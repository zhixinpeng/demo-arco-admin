export type Nullable<T> = T | null;
export type Recordable<T = any> = Record<string, T>;
export interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
