declare type Expression = (...args: Value[]) => Value;
declare type Value = string | boolean;

declare function id(value: Value): Value;
declare function concat(...values: string[]): string;
