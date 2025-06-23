use std::env;
use std::fs;
use std::path::Path;

use reqlang_expr_tspl::transpile;

const JSRUNTIME_SOURCE: &'static str = include_str!("./index.ts");
const ARG_SOURCE: &'static str = include_str!("../node_modules/arg/index.js");
const ARG_LICENSE: &'static str = include_str!("../node_modules/arg/LICENSE.md");
const LICENSE: &'static str = include_str!("../LICENSE");
const REQLANG_OBJ_PREFIX: &'static str = "ReqlangExpr.";

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Usage: {} <file_path>", args[0]);
        std::process::exit(1);
    }

    let file_path = &args[1];
    if !Path::new(file_path).exists() {
        eprintln!("Error: File '{}' does not exist.", file_path);
        std::process::exit(1);
    }

    let source = fs::read_to_string(file_path).expect("Unexpected error reading the file.");

    match transpile(&source) {
        Ok(transpiled_code) => {
            let transpiled_code = transpiled_code
                .replace(
                    "import * as ReqlangExpr from \"@reqlang-expr-tspl/runtime\";",
                    &JSRUNTIME_SOURCE,
                )
                .replace(&REQLANG_OBJ_PREFIX, "")
                .replace("import arg from \"arg\";", ARG_SOURCE);

            println!(
                "// @ts-nocheck\n/*\n{ARG_LICENSE}\n*/\n/*\n{LICENSE}\n*/\n{}",
                transpiled_code
            )
        }
        Err(err) => eprintln!("Error transpiling: {}", err),
    }
}
