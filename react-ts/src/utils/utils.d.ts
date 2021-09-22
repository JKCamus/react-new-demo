type Simplify<T> = {
  [P in keyof T]: T[P];
};

/**
 * @description: 支持将给定的 keys 对应的属性变成可选的，已经是可选的不变
 */
export type SetOptional<T, K extends keyof T> = Simplify<Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>>;

/**
 * @description: 支持将给定的 keys 对应的属性变成必选，已经是必选的不变
 */
export type SetRequired<T, K extends keyof T> = Simplify<Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>>;

/**
 * @description: 定义非空数组
 */
export type NonEmptyArray<T> = [T, ...T[]];
