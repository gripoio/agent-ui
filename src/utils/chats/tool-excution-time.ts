export function getToolExecutionTime(startTime:string, endTime:string ) {
  if (!startTime|| !endTime) {
    return "Unknown";
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  const durationMs = end.getTime() - start.getTime();

  // Return as seconds if more than 1 second
  if (durationMs >= 1000) {
    return (durationMs / 1000).toFixed(2) + "s";
  } else {
    return durationMs + "ms";
  }
}
