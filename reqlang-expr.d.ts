declare type Expression = (env: Env) => (...args: Value[]) => Value;
declare type Value = string | boolean;

declare function id(value: Value): Value;
declare function concat(...values: string[]): string;

declare type Env = {
  vars: Record<string, string>;
  prompts: Record<string, string>;
  secrets: Record<string, string>;
  client: Record<string, Value>;
};
