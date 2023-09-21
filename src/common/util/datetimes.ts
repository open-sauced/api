// converts the number of previous days into milliseconds and back to a date iso string
export const GetPrevDateISOString = (prev_start_date = 0): string =>
  new Date(Date.now() - prev_start_date * 24 * 60 * 60 * 1000).toISOString();
