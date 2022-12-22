export const toDateTime = (secs: number) => {
  // unix epoch start
  const t = new Date("1970-01-01T00:30:00Z");

  t.setSeconds(secs);
  return t;
};
