/// <reference path="../reqlang-expr.d.ts" />
export const expression: Expression = (env: Env) => () => {
  return env.prompts.a;
};
