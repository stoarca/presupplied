import { typedFetch, API_HOST } from './typedFetch';

export function setupTestMode(): void {
  const isTestMode = (window as any).__TEST_MODE__ === true;

  if (!isTestMode) {
    return;
  }

  // Override console methods to send logs to the server
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  const serializeArg = (arg: any): string => {
    if (arg === undefined) {
      return 'undefined';
    }
    if (arg === null) {
      return 'null';
    }

    if (arg instanceof Error) {
      return JSON.stringify({
        message: arg.message,
        stack: arg.stack,
        name: arg.name
      });
    }

    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }

    return String(arg);
  };

  const sendLog = async (args: any[], type: 'log' | 'error' = 'log') => {
    try {
      const logMessages = args.map(serializeArg);

      await typedFetch({
        host: API_HOST,
        endpoint: '/api/test/weblog',
        method: 'post',
        body: {
          message: logMessages.join(' '),
          type: type
        }
      });
    } catch (e) {
      // Use original console to avoid infinite recursion
      originalConsoleError('Failed to send log to server:', e);
    }
  };

  console.log = function(...args) {
    originalConsoleLog.apply(console, args);
    sendLog(args);
  };

  console.error = function(...args) {
    originalConsoleError.apply(console, args);
    sendLog(args, 'error');
  };

  console.warn = function(...args) {
    originalConsoleWarn.apply(console, args);
    sendLog(args, 'error');
  };

  // Also catch unhandled errors
  window.addEventListener('error', (event) => {
    // If there's an error object, send it directly to maintain stack trace
    if (event.error instanceof Error) {
      sendLog([event.error], 'error');
    } else {
      sendLog([{
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }], 'error');
    }
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    // If the reason is an Error object, send it directly to maintain stack trace
    if (event.reason instanceof Error) {
      sendLog([event.reason], 'error');
    } else {
      sendLog([{
        message: 'Unhandled Promise Rejection',
        reason: event.reason
      }], 'error');
    }
  });
}
