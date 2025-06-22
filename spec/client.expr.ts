export const expression: Expression = (env: Env) => () => {
  return env.client.a;
};
