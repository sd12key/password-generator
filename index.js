const process = require("process");

const APP_VERSION = "0.0.1";
const DEFAILT_ARG_PREFIXES = ["--", "-", "/"];
const DEFAULT_PASSWORD_CHARS = "abcdefghijklmnopqrstuvwxyz";
const DEFAULT_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

// console out error message and exit with code 1
function display_error_message(error_type, custom_message = "") {
  const ERROR_STR = "Error:";
  const error_messages = {
    argument_unrecognized:
      "Unrecognized parameter! Use --help for available options.",
    argument_duplicate: `Duplicate argument (${custom_message})! Each parameter (except help) must appear once.`,
    length_argument_missing: "Missing value for length parameter.",
    length_argument_integer: `Length must be an integer between ${DEFAULT_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}.`,
  };
  console.error(ERROR_STR, error_messages[error_type] || "Unknown failure!");
  process.exit(1);
}

const arguments_processing_array = [
  {
    arg_flags: ["help", "h", "?"],
    arg_name: "help",
    arg_length: 1,
    arg_handler_func: process_help_arg,
    arg_helper_message: "Show this help message.",
    arg_processed: false,
  },
  {
    arg_flags: ["length", "len", "l"],
    arg_name: "length",
    arg_length: 2,
    arg_handler_func: process_length_arg,
    arg_helper_message: `Specify the length of the password (>=${DEFAULT_PASSWORD_LENGTH}, def.${DEFAULT_PASSWORD_LENGTH}, max.${MAX_PASSWORD_LENGTH}).`,
    arg_processed: false,
  },
];

function process_help_arg() {
  console.log("\nUsage: node run passgen [options]\n");

  arguments_processing_array.forEach((argument) => {
    const possible_flags = DEFAILT_ARG_PREFIXES.map((prefix) =>
      argument.arg_flags.map((flag) => prefix + flag).join(", ")
    ).join(", ");
    console.log(possible_flags);
    console.log(argument.arg_helper_message);
  });

  process.exit(0);
}

function process_length_arg(passed_arguments, index) {
  const next_arg = passed_arguments[index + 1];
  if (!next_arg) {
    display_error_message("length_argument_missing");
  }

  const length = parseInt(next_arg, 10);
  if (
    isNaN(length) ||
    length < DEFAULT_PASSWORD_LENGTH ||
    length > MAX_PASSWORD_LENGTH
  ) {
    display_error_message("length_argument_integer");
  }

  password_length = length;
}

function analyze_program_arguments(passed_arguments) {
  console.log("Processing arguments");
  for (let i = 0; i < passed_arguments.length; ) {
    const arg = passed_arguments[i];
    let is_recognized = false;

    for (const argument of arguments_processing_array) {
      if (
        argument.arg_flags.some((flag) =>
          DEFAILT_ARG_PREFIXES.some((prefix) => arg === prefix + flag)
        )
      ) {
        if (argument.arg_processed) {
          display_error_message("argument_duplicate", argument.arg_name);
        } else {
          argument.arg_handler_func(passed_arguments, i);
          argument.arg_processed = true;
        }
        is_recognized = true;

        // increment i by the number of parts of the argument (1+) to skip them
        i += argument.arg_length;
        break;
      }
    }

    if (!is_recognized) {
      display_error_message("argument_unrecognized");
    } else {
      continue;
    }

    // for one-part arguments, increment i by 1
    i++;
  }
}

function generate_password(password_length, password_valid_chars) {
  const char_count = {};
  let new_password = "";
  while (new_password.length < password_length) {
    const char = password_valid_chars.charAt(
      Math.floor(Math.random() * password_valid_chars.length)
    );
    new_password += char;
  }
  return new_password;
}

let password_length = DEFAULT_PASSWORD_LENGTH;
let password_chars = DEFAULT_PASSWORD_CHARS;

console.log("\nPassword Generator CLI, ver." + APP_VERSION);

const passed_arguments = process.argv.slice(2).map((arg) => arg.toLowerCase());
analyze_program_arguments(passed_arguments);
console.log("(run with --help to see available options)\n");

console.log("---> password_length    ---> " + password_length + " characters");
const generated_password = generate_password(password_length, password_chars);
console.log("---> generated password ---> " + generated_password);

process.exit(0);
