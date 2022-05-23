export const limitDecimals = (n: number | string, d: number) =>
  String(+Number(n).toFixed(d));
