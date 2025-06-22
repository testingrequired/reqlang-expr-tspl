export const expression: Expression = (env: Env) => () => {
  return concat("Hello", " ", "World");
};
