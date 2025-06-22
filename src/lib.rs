use reqlang_expr::prelude::*;

pub fn transpile(source: &str) -> Result<String, String> {
    let ast = parse(source);

    match ast {
        Ok(ast) => {
            let body = transpile_expr(&ast);

            let template = format!(
                "/// <reference path=\"../reqlang-expr.d.ts\" />\nexport const expression: Expression = () => {{\n  return {body};\n}};\n"
            );

            Ok(template)
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
            format!("{}", expr_identifier.name())
        }
        Expr::Call(expr_call) => {
            let callee = expr_call.callee.0.identifier_name().unwrap();
            let args: Vec<String> = expr_call
                .args
                .iter()
                .map(|expr| transpile_expr(&expr.0))
                .collect();

            format!("{callee}({})", args.join(", "))
        }
        Expr::String(expr_string) => {
            format!("\"{}\"", expr_string.0)
        }
        Expr::Error => todo!(),
    }
}
