export class IdUtil {
  private static id = 0;

  static create() {
    return ++IdUtil.id;
  }
}
