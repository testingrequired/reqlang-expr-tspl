use reqlang_expr_tspl::transpile;
use rstest::rstest;
use std::{error::Error, fs::read_to_string, path::PathBuf};

#[rstest]
fn spec_files_interpreted(#[files("spec/*.expr")] path: PathBuf) -> Result<(), Box<dyn Error>> {
    let ts_path = path.with_extension("expr.ts");
    let expr_source = read_to_string(path).expect("should be able to read file");

    if ts_path.exists() {
        let ts: String = read_to_string(ts_path).expect("should be able to read file");

        let result = transpile(&expr_source)?;

        pretty_assertions::assert_eq!(ts, result);
    } else {
        panic!("No ts file found for the expression file");
    }

    Ok(())
}
