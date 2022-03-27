export const exitProcess = (code = 1) => {
  // eslint-disable-next-line no-process-exit
  process.exit(code);
};

export const firstUpper = (s: string) => {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
};
