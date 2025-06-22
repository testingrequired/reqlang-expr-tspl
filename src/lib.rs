use reqlang_expr::prelude::*;

pub fn transpile(source: &str) -> Result<String, String> {
    let ast = parse(source);

    match ast {
        Ok(ast) => {
            let body = transpile_expr(&ast);

            let template = textwrap::dedent(
                "
            import * as ReqlangExpr from \"@reqlang-expr-tspl/runtime\";

            const expression: ReqlangExpr.Expression = (ctx) => {
              return %BODY%;
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
            ",
            );

            let transpiled_code = template.trim_start().replace("%BODY%", &body);

            Ok(transpiled_code)
        }
        Err(err) => Err(format!("{err:#?}")),
    }
}

fn transpile_expr(expr: &Expr) -> String {
    match expr {
        Expr::Bool(expr_bool) => {
            let value = expr_bool.0;

            format!("{value}")
        }
        Expr::Identifier(expr_identifier) => {
            let identifier = expr_identifier.name();
            let identifier_prefix = &identifier[..1];
            let identifier_suffix = &identifier[1..];

            match identifier_prefix {
                "?" => {
                    format!("ctx.env.getPrompt(\"{}\")", identifier_suffix)
                }
                "!" => {
                    format!("ctx.env.getSecret(\"{}\")", identifier_suffix)
                }
                ":" => {
                    format!("ctx.env.getVar(\"{}\")", identifier_suffix)
                }
                "@" => {
                    format!("ctx.env.getClient(\"{}\")", identifier_suffix)
                }
                _ => {
                    format!("{}", expr_identifier.name())
                }
            }
        }
        Expr::Call(expr_call) => {
            let callee = expr_call.callee.0.identifier_name().unwrap();
            let args: Vec<String> = expr_call
                .args
                .iter()
                .map(|expr| transpile_expr(&expr.0))
                .collect();

            format!("ctx.builtins.{callee}({})", args.join(", "))
        }
        Expr::String(expr_string) => {
            format!("\"{}\"", expr_string.0)
        }
        Expr::Error => todo!(),
    }
}
