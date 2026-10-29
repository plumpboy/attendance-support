import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Select from 'react-select';
import { fetchLogData, postWorkLogs, getProjects } from '../../api/sra';
import {
  getMonthRange,
  getPendingDays,
  summarizeProjects,
  buildEntries,
  validateSplits,
  newRowHours,
  sumHours,
  projectLabel,
} from './workLogPlan';
import { SRA_URL, isUnauthorized } from '../../utils/sraAuth';

// Last used split per project code, so the next month starts from it
const SPLITS_KEY = 'sraWorkSplits';

const loadSavedSplits = () => {
  try {
    return JSON.parse(localStorage.getItem(SPLITS_KEY)) || {};
  } catch (e) {
    return {};
  }
};

const saveSplits = (splits) => {
  try {
    localStorage.setItem(
      SPLITS_KEY,
      JSON.stringify({ ...loadSavedSplits(), ...splits })
    );
  } catch (e) {}
};

const selectStyles = {
  control: (styles) => ({ ...styles, minHeight: 32 }),
  menuPortal: (styles) => ({ ...styles, zIndex: 10 }),
};

const errorText = (e) => e.response?.data?.message || e.message;

const LogWorkPlanner = ({
  accessToken,
  userData,
  month,
  workOption,
  isLoadingWorkType,
  onError,
  onSessionExpired,
  onSuccess,
}) => {
  // null while the month's timesheet is loading
  const [pendingDays, setPendingDays] = useState(null);
  const [splits, setSplits] = useState({});
  // Entries with resolved project ids, shown for confirmation before anything is logged
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState('');
  const [projectNames, setProjectNames] = useState({});
  // SRA projects per date, the source of project ids and names
  const projectsByDate = useRef({});

  const projects = useMemo(
    () => summarizeProjects(pendingDays || []),
    [pendingDays]
  );
  const label = (code) => projectLabel(code, projectNames[code]);
  const typeLabel = (id) =>
    workOption.find((option) => option.value === id)?.label || id;

  const fetchProjects = useCallback(
    async (date) => {
      if (!projectsByDate.current[date]) {
        projectsByDate.current[date] = await getProjects(accessToken, {
          userId: userData?.id,
          date,
        });
      }
      return projectsByDate.current[date];
    },
    [accessToken, userData]
  );

  // Names the timesheet doesn't have are looked up in the SRA projects of each project's first date
  const loadProjectNames = useCallback(
    async (summary) => {
      const names = {};
      summary.forEach(({ code, name }) => name && (names[code] = name));
      setProjectNames(names);
      try {
        for (const { code, firstDate } of summary.filter(({ name }) => !name)) {
          const project = (await fetchProjects(firstDate)).find(
            (project) => project.code === code
          );
          if (project?.name) names[code] = project.name;
        }
        setProjectNames({ ...names });
      } catch (e) {
        // Not critical: projects are shown by code only
        console.error('Failed to load project names', e);
      }
    },
    [fetchProjects]
  );

  const loadTimesheet = useCallback(async () => {
    setPendingDays(null);
    setPreview(null);
    projectsByDate.current = {};
    try {
      const overview = await fetchLogData(accessToken, {
        username: userData?.username,
        ...getMonthRange(month),
      });
      const days = getPendingDays(overview);
      const summary = summarizeProjects(days);
      const saved = loadSavedSplits();
      const initialSplits = {};
      summary.forEach(({ code, fullDayHours }) => {
        initialSplits[code] = saved[code] || [
          { typeOfWork: null, hours: fullDayHours },
        ];
      });
      setSplits(initialSplits);
      setPendingDays(days);
      loadProjectNames(summary);
    } catch (e) {
      setPendingDays([]);
      if (isUnauthorized(e)) {
        onSessionExpired();
        return;
      }
      onError(`Failed to load timesheet: ${errorText(e)}`);
    }
  }, [
    accessToken,
    userData,
    month,
    onError,
    onSessionExpired,
    loadProjectNames,
  ]);

  useEffect(() => {
    loadTimesheet();
  }, [loadTimesheet]);

  const updateRows = (code, update) => {
    setSplits((current) => ({ ...current, [code]: update(current[code]) }));
    onError('');
  };

  const addRow = (code, fullDayHours) =>
    updateRows(code, (rows) => {
      const hours = newRowHours(rows, fullDayHours);
      // Take the new row's hours from the biggest row, so the day total stays the same
      const biggest = rows.reduce(
        (max, row, index) =>
          row.hours > (rows[max]?.hours || 0) ? index : max,
        0
      );
      const updated = rows.map((row, index) =>
        index === biggest && rows.length > 0
          ? { ...row, hours: row.hours - hours }
          : row
      );
      return [...updated, { typeOfWork: null, hours }];
    });

  const changeRow = (code, index, patch) =>
    updateRows(code, (rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );

  const removeRow = (code, index) =>
    updateRows(code, (rows) => rows.filter((_, i) => i !== index));

  const showPreview = async () => {
    const error = validateSplits(
      projects.map((project) => ({
        ...project,
        name: projectNames[project.code],
      })),
      splits
    );
    if (error) {
      onError(error);
      return;
    }
    const entries = buildEntries(pendingDays, splits);
    if (entries.length === 0) {
      onError('Every project is skipped, add a type of work to log');
      return;
    }

    setProgress('Preparing...');
    try {
      // SRA project ids are looked up per date, like SRA itself does
      for (const date of new Set(entries.map((entry) => entry.date))) {
        await fetchProjects(date);
      }
      const withIds = entries.map((entry, index) => ({
        ...entry,
        // Stable row key, rows can be deleted
        id: index,
        projectId: projectsByDate.current[entry.date]?.find(
          (project) => project.code === entry.code
        )?.id,
      }));
      const missing = withIds.find((entry) => !entry.projectId);
      if (missing) {
        onError(
          `Project ${label(missing.code)} not found in SRA on ${missing.date}`
        );
        return;
      }
      saveSplits(splits);
      setPreview(withIds);
    } catch (e) {
      if (isUnauthorized(e)) {
        onSessionExpired();
        return;
      }
      onError(`Failed to load projects: ${errorText(e)}`);
    } finally {
      setProgress('');
    }
  };

  const changePreview = (id, patch) => {
    setPreview((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
    onError('');
  };

  const removePreview = (id) => {
    setPreview((rows) => rows.filter((row) => row.id !== id));
    onError('');
  };

  const logWork = async () => {
    const invalid = preview.find((entry) => !(entry.hours > 0));
    if (invalid) {
      onError(
        `${invalid.date} ${label(invalid.code)}: hours must be more than 0`
      );
      return;
    }

    for (let i = 0; i < preview.length; i++) {
      const entry = preview[i];
      setProgress(`Logging ${i + 1}/${preview.length}...`);
      try {
        await postWorkLogs(accessToken, {
          workLogs: [
            {
              date: entry.date,
              description: null,
              workHours: entry.hours,
              typeOfWork: entry.typeOfWork,
              projectId: entry.projectId,
            },
          ],
        });
      } catch (e) {
        setProgress('');
        const saved = `${i} of ${preview.length} work logs were saved.`;
        if (isUnauthorized(e)) {
          onSessionExpired();
          onError(`SRA session expired, please log in to SRA again. ${saved}`);
          return;
        }
        onError(
          `Failed on ${entry.date} ${label(entry.code)} (${typeLabel(
            entry.typeOfWork
          )}): ${errorText(e)}. ${saved}`
        );
        loadTimesheet();
        return;
      }
    }
    setProgress('');
    onSuccess(`Logged ${preview.length} work logs (${sumHours(preview)}h)!`);
    // Show the new logs on the open SRA pages
    chrome.tabs.query({ url: `${SRA_URL}*` }, (tabs) =>
      tabs.forEach((tab) => chrome.tabs.reload(tab.id))
    );
    loadTimesheet();
  };

  if (pendingDays === null) {
    return <p className="planner-note">Loading timesheet...</p>;
  }

  if (projects.length === 0) {
    return (
      <p className="planner-note">
        All allocated hours of this month are already logged.
      </p>
    );
  }

  if (preview) {
    return (
      <div className="planner">
        <p className="planner-summary">
          <strong>{preview.length}</strong> work logs,{' '}
          <strong>{sumHours(preview)}h</strong> in total
        </p>
        <div className="planner-preview">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Type of work</th>
                <th className="hours">Hours</th>
                <th aria-label="Delete" />
              </tr>
            </thead>
            <tbody>
              {preview.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{label(entry.code)}</td>
                  <td>
                    <select
                      className="preview-type"
                      value={entry.typeOfWork}
                      disabled={!!progress}
                      onChange={(e) =>
                        changePreview(entry.id, {
                          typeOfWork: workOption.find(
                            (option) => String(option.value) === e.target.value
                          )?.value,
                        })
                      }
                      aria-label="Type of work"
                    >
                      {workOption.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="hours">
                    <span className="preview-hours-cell">
                      <input
                        className="preview-hours"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={entry.hours}
                        disabled={!!progress}
                        onChange={(e) =>
                          changePreview(entry.id, {
                            hours: Number(e.target.value),
                          })
                        }
                        aria-label="Hours"
                      />
                      h
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      title="Delete this work log"
                      disabled={!!progress}
                      onClick={() => removePreview(entry.id)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {preview.length === 0 && (
                <tr>
                  <td colSpan="5" className="preview-empty">
                    All work logs deleted, go back to plan again
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="planner-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={!!progress}
            onClick={() => setPreview(null)}
          >
            Back
          </button>
          <button
            type="button"
            className="log-button"
            disabled={!!progress || preview.length === 0}
            onClick={logWork}
          >
            {progress || `Log ${preview.length} work logs`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="planner">
      <p className="planner-summary">
        Split each project's day between types of work. Days with fewer hours
        left are split in the same ratio.
      </p>
      {projects.map(({ code, days, totalHours, fullDayHours }) => {
        const rows = splits[code] || [];
        const total = sumHours(rows);
        return (
          <div className="project-card" key={code}>
            <div className="project-header">
              <strong>{label(code)}</strong>
              <span>
                {days} day(s) · {totalHours}h to log
              </span>
            </div>
            {rows.map((row, index) => (
              <div className="split-row" key={index}>
                <Select
                  className="split-type"
                  options={workOption}
                  value={
                    workOption.find(
                      (option) => option.value === row.typeOfWork
                    ) || null
                  }
                  onChange={(option) =>
                    changeRow(code, index, { typeOfWork: option.value })
                  }
                  isLoading={isLoadingWorkType}
                  placeholder="Type of work"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
                <input
                  className="split-hours"
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={row.hours}
                  onChange={(e) =>
                    changeRow(code, index, { hours: Number(e.target.value) })
                  }
                  aria-label="Hours per day"
                />
                <span className="split-unit">h</span>
                <button
                  type="button"
                  className="icon-button"
                  title="Remove"
                  onClick={() => removeRow(code, index)}
                >
                  ×
                </button>
              </div>
            ))}
            <div className="project-footer">
              <button
                type="button"
                className="link-button"
                onClick={() => addRow(code, fullDayHours)}
              >
                + Add type of work
              </button>
              {rows.length === 0 ? (
                <span className="split-hint warn">
                  Skipped, won't be logged
                </span>
              ) : (
                <span
                  className={`split-hint ${
                    total === fullDayHours ? 'ok' : 'warn'
                  }`}
                >
                  {total}h of {fullDayHours}h a day
                  {total !== fullDayHours && ', will be scaled'}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <button
        type="button"
        className="log-button"
        disabled={!!progress}
        onClick={showPreview}
      >
        {progress || 'Preview work logs'}
      </button>
    </div>
  );
};

export default LogWorkPlanner;
