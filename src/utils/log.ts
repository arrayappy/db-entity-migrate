const logLevels: { [key: string]: number } = {
  info: 1,
  warn: 2,
  error: 3,
};

const log = (msg: string, data: any, userLevel: string, level?: string) => {
  level = level || 'info';
  if (logLevels[level] >= logLevels[userLevel || 'info']) {
    const ts = new Date().toISOString();
    const terminalLog = `[${ts}] [${level.toUpperCase()}] ${msg}`;
    const fileLog = { ts, level, msg, data };

    switch (level) {
      case 'info':
      case 'warn':
        console.log(terminalLog);
        return fileLog;
      case 'error':
        console.error(terminalLog);
        return fileLog;
    }
  }
};

export {
  log
}