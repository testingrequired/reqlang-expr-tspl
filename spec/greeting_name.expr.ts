import * as ReqlangExpr from "@reqlang-expr-tspl/runtime";

const args = ReqlangExpr.getArgs();

const expression: ReqlangExpr.Expression = (ctx) => {
  return ctx.builtins.concat(ctx.env.getVar("greeting"), " ", ctx.env.getPrompt("name"));
};

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
