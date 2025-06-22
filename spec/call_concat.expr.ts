/// <reference path="../reqlang-expr.d.ts" />
export const expression: Expression = (env: Env) => () => {
  return concat("Hello", " ", "World");
};
