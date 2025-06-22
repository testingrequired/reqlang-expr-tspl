export const expression: Expression = (env: Env) => () => {
  return id(id("foo"));
};
