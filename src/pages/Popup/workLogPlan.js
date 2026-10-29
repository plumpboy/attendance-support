// Plans SRA work logs: which days and projects still need hours,
// and how each project's hours are split between types of work

const HOUR_STEP = 0.25;

const roundHours = (hours) => Math.round(hours * 100) / 100;

const toDateString = (date) => date.toISOString().split('T')[0];

// yyyy-MM month -> SRA date range, the end capped at today
export function getMonthRange(month) {
  const date = new Date(`${month}-02T00:00:00`);
  // Day 2 and day 1 of the next month: toISOString() shifts local midnight back a day in UTC+ timezones
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 2);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const now = new Date();

  return {
    startDate: toDateString(firstDayOfMonth),
    endDate: toDateString(lastDayOfMonth > now ? now : lastDayOfMonth),
  };
}

// Working days with allocated hours not logged yet, and the hours left per allocated project
export function getPendingDays(overview) {
  return (overview?.timesheetOverview || [])
    .filter(
      (day) =>
        !day.isWeekend &&
        !day.isHoliday &&
        day.allocated?.totalHours > 0 &&
        (!day.workLogs || day.workLogs.totalHours < day.allocated.totalHours)
    )
    .map((day) => {
      const logged = Object.values(day.workLogs?.detail || {});
      const projects = (day.allocated.detail || [])
        .map((allocated) => {
          const loggedHours = logged
            .filter((log) => log.code === allocated.code)
            .reduce((sum, log) => sum + (log.hours || 0), 0);
          return {
            code: allocated.code,
            name: allocated.name || allocated.projectName,
            allocatedHours: allocated.hours,
            remainingHours: roundHours(
              Math.max(0, allocated.hours - loggedHours)
            ),
          };
        })
        .filter((project) => project.remainingHours > 0);
      return { date: day.date, projects };
    })
    .filter((day) => day.projects.length > 0);
}

// Per project: days and total hours still to log, the hours of a full day and the first date to log
export function summarizeProjects(pendingDays) {
  const projects = {};
  pendingDays.forEach((day) =>
    day.projects.forEach(({ code, name, allocatedHours, remainingHours }) => {
      if (!projects[code]) {
        projects[code] = {
          code,
          name,
          firstDate: day.date,
          days: 0,
          totalHours: 0,
          fullDayHours: 0,
        };
      }
      const project = projects[code];
      project.days += 1;
      project.totalHours = roundHours(project.totalHours + remainingHours);
      project.fullDayHours = Math.max(project.fullDayHours, allocatedHours);
    })
  );
  return Object.values(projects);
}

// Split one day's hours between types of work, in proportion to the hours of each split row.
// Shares are rounded to 15 minutes, the last type takes what is left so the total stays exact.
export function splitHours(hours, rows) {
  const weighted = rows.filter((row) => row.hours > 0);
  const totalWeight = weighted.reduce((sum, row) => sum + row.hours, 0);
  let left = hours;

  return weighted
    .map((row, index) => {
      const share =
        index === weighted.length - 1
          ? left
          : Math.min(
              left,
              Math.round((hours * row.hours) / totalWeight / HOUR_STEP) *
                HOUR_STEP
            );
      left = roundHours(left - share);
      return { typeOfWork: row.typeOfWork, hours: roundHours(share) };
    })
    .filter((entry) => entry.hours > 0);
}

// One work log per day, project and type of work. Projects without split rows are skipped.
export function buildEntries(pendingDays, splits) {
  return pendingDays.flatMap((day) =>
    day.projects.flatMap((project) =>
      splitHours(project.remainingHours, splits[project.code] || []).map(
        (entry) => ({ date: day.date, code: project.code, ...entry })
      )
    )
  );
}

// Error message for the first invalid split row, '' when every row is valid
export function validateSplits(projects, splits) {
  for (const { code, name } of projects) {
    const rows = splits[code] || [];
    if (rows.some((row) => !(row.hours > 0))) {
      return `${projectLabel(
        code,
        name
      )}: every type of work needs more than 0 hours`;
    }
    if (rows.some((row) => !row.typeOfWork)) {
      return `${projectLabel(code, name)}: select a type of work for every row`;
    }
  }
  return '';
}

// Default for a new split row: half of the biggest row, so [8h] becomes [4h, 4h]
export function newRowHours(rows, fullDayHours) {
  if (rows.length === 0) return fullDayHours;
  const biggest = Math.max(...rows.map((row) => row.hours || 0));
  return Math.floor(biggest / 2 / HOUR_STEP) * HOUR_STEP;
}

// "Project name (CODE)", or just the code when the name is unknown
export function projectLabel(code, name) {
  return name ? `${name} (${code})` : code;
}

export function sumHours(rows) {
  return roundHours(rows.reduce((sum, row) => sum + (row.hours || 0), 0));
}
