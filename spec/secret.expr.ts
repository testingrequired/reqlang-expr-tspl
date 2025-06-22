export const expression: Expression = (env: Env) => () => {
  return env.secrets.a;
};
