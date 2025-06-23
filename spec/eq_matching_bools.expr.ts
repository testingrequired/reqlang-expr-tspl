import * as ReqlangExpr from "@reqlang-expr-tspl/runtime";

const expression: ReqlangExpr.Expression = (ctx) => {
  return (true as ReqlangExpr.ExprValue === true as ReqlangExpr.ExprValue);
};

const args = ReqlangExpr.getArgs();

const env = new ReqlangExpr.Env(
  args.vars,
  args.prompts,
  args.secrets,
  args.client
);

const context = {
  env,
  builtins: ReqlangExpr.builtinFns,
};

const value = expression(context);

console.log(JSON.stringify(value));
