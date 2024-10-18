/**
 * Typed mapping function.
 */
export type Mapper<T extends unknown[], G> = (...args: T) => G;
