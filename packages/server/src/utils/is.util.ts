export class IsUtil {
  static isObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  static isPlanObject(value: unknown): value is Record<string, unknown> {
    return IsUtil.isObject(value) && value.constructor === Object;
  }

  static isArray(value: unknown): value is Array<any> {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  static isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  static isInteger(value: unknown): value is number {
    return typeof value === 'number' && value % 1 === 0;
  }

  static isFloat(value: unknown): value is number {
    return typeof value === 'number' && value % 1 !== 0;
  }

  static isEmpty(value: unknown) {
    if (value === undefined) {
      return true;
    }
    if (value === null) {
      return true;
    }
    if (typeof value === 'string' || IsUtil.isArray(value)) {
      if (value.length <= 0) {
        return true;
      }
    }
    if (IsUtil.isPlanObject(value)) {
      if (Object.keys(value).length <= 0) {
        return true;
      }
    }
    return false;
  }

  static isEqual(value1: unknown, value2: unknown) {
    if (value1 === value2) {
      return true;
    }
    if (IsUtil.isArray(value1) && IsUtil.isArray(value2)) {
      if (value1.length !== value2.length) {
        return false;
      }
      for (let i = 0; i < value1.length; i++) {
        if (!IsUtil.isEqual(value1[i], value2[i])) {
          return false;
        }
      }
      return true;
    }
    if (IsUtil.isObject(value1) && IsUtil.isObject(value2)) {
      const entries1 = Object.entries(value1);
      const entries2 = Object.entries(value2);
      return IsUtil.isEqual(entries1, entries2);
    }
    return false;
  }
}
