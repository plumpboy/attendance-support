features:
+ today working time
  - estimate checkout time to fullfill 6h and 8h
  - show current day working time

+ monthy report
  - calculate late arrival days (8 > x > =6)
  - calculate wfh days ( < 6h)

+ utils:
  - auto create attendance requests
  - auto create leaves

  priority:
    1.attendance requests: non-checkin > below 6 > below 8
    2.leaves: non-checkin < below 6 < below 8

    if none of requests remain, use leave

  flow: show popup contain request list then user can approve request or skip.

+ ui (content script)

  - create button to show pop up, a badge to show remaining requests(attendance requests and latable days), current late arrival days and wfh days

