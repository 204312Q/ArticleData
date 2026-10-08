export function logError(message: string, error?: unknown) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (typeof error === 'undefined') {
    console.error(message);
    return;
  }

  console.error(message, error);
}
