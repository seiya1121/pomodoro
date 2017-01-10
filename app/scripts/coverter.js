export const s2m = (s) => {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  // return `${('0' + minutes.toString()).slice(-2)}:${('0' + seconds.toString()).slice(-2)}`;
  return `${minutes}:${seconds}`;
};
