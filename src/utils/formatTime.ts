export function formatTime(milliseconds: number): string {
  const safeMilliseconds = Math.max(0, Math.floor(milliseconds));
  const seconds = Math.floor(safeMilliseconds / 1000);
  const ms = safeMilliseconds % 1000;

  return `${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}
