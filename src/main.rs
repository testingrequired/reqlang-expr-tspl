use std::env;
use std::fs;
use std::path::Path;

use reqlang_expr_tspl::transpile;

const JSRUNTIME_SOURCE: &'static str = include_str!("./index.ts");
const JSRUNTIME_IMPORT: &'static str =
    "import * as ReqlangExpr from \"@reqlang-expr-tspl/runtime\";";
const REQLANGEXPR_LICENSE: &'static str = include_str!("../LICENSE");
const REQLANGEXPR_OBJ_PREFIX: &'static str = "ReqlangExpr.";

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
    let jsruntime_source = JSRUNTIME_SOURCE.replace("export ", "");
    let licenses = format!("/*\n{REQLANGEXPR_LICENSE}\n*/\n");

    match transpile(&source) {
        Ok(transpiled_code) => {
            let transpiled_code = transpiled_code
                .replace(JSRUNTIME_IMPORT, &jsruntime_source)
                .replace(REQLANGEXPR_OBJ_PREFIX, "");

            println!("{licenses}{transpiled_code}")
        }
        Err(err) => eprintln!("Error transpiling: {}", err),
    }
}
