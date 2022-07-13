export * from './EventEmitter';

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomNums = (min: number, max: number, qty: number) => {
  const result: number[] = [];
  while (result.length < qty) {
    const value = random(min, max);
    if (!result.includes(value)) {
      result.push(value);
    }
  }
  return result;
};

export const delay = (callback: () => void, time: number) => {
  let timer: ReturnType<typeof setTimeout>;
  const start = (_callback?: () => void, _time?: number) => {
    callback = _callback ?? callback;
    time = _time ?? time;
    stop();
    timer = setTimeout(callback, time);
  };
  const stop = () => {
    clearTimeout(timer);
  };
  const reset = (_time?: number) => {
    stop();
    timer = setTimeout(callback, _time ?? time);
  };
  return { start, stop, reset };
};
