export function logInfo(message: string, meta?: any) {
  const log = {
    timestamp: new Date().toISOString(),
    level: "INFO",
    message,
    ...(meta && { meta })
  };
  // Use console.error because stdout is used by the MCP protocol
  console.error(JSON.stringify(log));
}

export function logError(message: string, error?: any) {
  const log = {
    timestamp: new Date().toISOString(),
    level: "ERROR",
    message,
    ...(error && { error: error.message || error })
  };
  console.error(JSON.stringify(log));
}
