export interface Response<T> {
  code: number;
  data: T;
  message: string;
}

export class Result {
  static SUCCESS = new Result(1, 'success');
  static FAIL = new Result(0, 'fail');

  success: boolean;

  constructor(public code: number, public message: string, public data: any = {}) {
    this.success = code === 1;
  }

  build<T>(data?: T, message?: string): Response<T> {
    return {
      code: this.code,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data: typeof data?.toJSON === 'function' ? data.toJSON() : data,
      message: message || this.message,
    };
  }
}
