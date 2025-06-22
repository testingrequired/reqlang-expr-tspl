import * as ReqlangExpr from "@reqlang-expr-tspl/runtime";

const expression: ReqlangExpr.Expression = (ctx) => {
  return "foo";
};

const env = ReqlangExpr.Env.new();

const context = {
  env,
  builtins: ReqlangExpr.builtinFns,
};

const value = expression(context);

console.log(JSON.stringify(value));
