export const partialOnce = (fn, ...args) => () => fn(...args);
