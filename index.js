// new version of password generator, with command line arguments
const process = require("process");

const APP_VERSION = "0.0.2";
const DEFAULT_ARG_PREFIXES = ["--", "-", "/"];
const DEFAULT_PASSWORD_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SPECIAL_CHARS = "!@#$%^&*()_+[]?~\\/{}";
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

//array of objects with argument processing data
const arguments_processing_array = [
  {
    arg_flags: ["help", "h", "?"],
    arg_name: "help",
    arg_length: 1,
    arg_handler_func: process_help_arg,
    arg_helper_message: "Show this help message.\n",
    arg_processed: false,
  },
  {
    arg_flags: ["length", "len", "l"],
    arg_name: "length",
    arg_length: 2,
    arg_handler_func: process_length_arg,
    arg_helper_message: `Specify the password length <number> (>=${DEFAULT_PASSWORD_LENGTH}, def.${DEFAULT_PASSWORD_LENGTH}, max.${MAX_PASSWORD_LENGTH}).\n`,
    arg_processed: false,
  },
  {
    arg_flags: ["uppercase", "upper", "u"],
    arg_name: "uppercase",
    arg_length: 1,
    arg_handler_func: process_single_arg,
    arg_helper_message: "Password will include uppercase characters.\n",
    arg_processed: false,
    arg_set: DEFAULT_PASSWORD_CHARS.toUpperCase(),
    arg_set_char_count: 0,
  },
  {
    arg_flags: ["numbers", "num", "n"],
    arg_name: "numbers",
    arg_length: 1,
    arg_handler_func: process_single_arg,
    arg_helper_message: "Password will include numbers as well.\n",
    arg_processed: false,
    arg_set: NUMBERS,
    arg_set_char_count: 0,
  },
  {
    arg_flags: ["special", "spec", "s"],
    arg_name: "special",
    arg_length: 1,
    arg_handler_func: process_single_arg,
    arg_helper_message: `Include special characters ${SPECIAL_CHARS} as well.\n`,
    arg_processed: false,
    arg_set: SPECIAL_CHARS,
    arg_set_char_count: 0,
  },
];

function process_help_arg() {
  console.log("\nUsage: npm run passgen [options]\n");

  arguments_processing_array.forEach((argument) => {
    const possible_flags = DEFAULT_ARG_PREFIXES.map((prefix) =>
      argument.arg_flags.map((flag) => prefix + flag).join(", ")
    ).join(", ");
    console.log(possible_flags);
    console.log(argument.arg_helper_message);
  });

  process.exit(0);
}

// function to process length argument
function process_length_arg(passed_arguments, index, agr_array_index) {
  // check if there is a next argument
  const next_arg = passed_arguments[index + 1];
  if (!next_arg) {
    display_error_message("length_argument_missing");
  }

  // try parsing to an integer
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

function process_single_arg(passed_arguments, index, arg_array_index) {
  //   console.log(arg_array_index);
  password_chars += arg_array_index.arg_set;
}

function analyze_program_arguments(passed_arguments) {
  //   console.log("Processing arguments");
  // loop through all program arguments
  for (let i = 0; i < passed_arguments.length; ) {
    const arg = passed_arguments[i];
    let is_recognized = false;

    // for each argument, check if it is recognized
    // we look through all arguments_processing_array objects
    for (const argument of arguments_processing_array) {
      if (
        argument.arg_flags.some((flag) =>
          DEFAULT_ARG_PREFIXES.some((prefix) => arg === prefix + flag)
        )
      ) {
        // check if the argument is already processed, do not allow duplicates
        if (argument.arg_processed) {
          display_error_message("argument_duplicate", argument.arg_name);
        } else {
          // this is where we call the handler function for the argument
          // it is responsible for processing the argument
          argument.arg_processed = true;
          argument.arg_handler_func(passed_arguments, i, argument);
        }
        is_recognized = true;

        // increment i by the number of parts of the argument (1+) to skip them
        // currently is it only for the length argument
        i += argument.arg_length;
        break;
      }
    }

    // if argument is not recognized, display error message
    if (!is_recognized) {
      display_error_message("argument_unrecognized");
    } else {
      continue;
    }

    // for one-part arguments, increment i by 1
    i++;
  }
}

// function to generate password (from lowercase letters)
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

// this function will ensure that the password contains
// at least one character from each optional set (num, upper, spec)
function ensure_optional_characters(password) {
  // we need to track the positions of optional characters in the password
  // the set will contain the positions of the optional characters
  const filled_optional_chars = new Set();

  // scroll through the password to count optional characters
  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    // check if the character belongs to any optional arg_set
    arguments_processing_array.forEach((arg) => {
      if (arg.arg_set && arg.arg_set.includes(char)) {
        // increase the count for this character set
        arg.arg_set_char_count++;
        // remember the position of the optional character
        filled_optional_chars.add(i);
      }
    });
  }

  //   console.log("filled optional character positions:", filled_optional_chars);
  //   arguments_processing_array.forEach((arg) => {
  //     if (arg.arg_set) {
  //       console.log(`count for ${arg.arg_name}: ${arg.arg_set_char_count}`);
  //     }
  //   });

  // convert to array (easier to replace chars)
  let new_password = password.split("");

  // scroll through arguments_processing_array again
  // to check the count of optional characters, add if needed
  // we need at least one character from each optional set
  // (this only in case the corresponding argument was set)
  // arg.arg_processed is true if the argument was set at the program run
  arguments_processing_array.forEach((arg) => {
    if (arg.arg_set && arg.arg_processed && arg.arg_set_char_count === 0) {
      // Generate a missing character and find a position for it to replace
      while (true) {
        // 1. generate a random position in the password
        const random_position = Math.floor(Math.random() * password.length);

        // 2. ensure the position is not already taken
        if (!filled_optional_chars.has(random_position)) {
          // Generate a random character from the missing set
          const missing_char = arg.arg_set.charAt(
            Math.floor(Math.random() * arg.arg_set.length)
          );

          // 3. replace the character at the selected position
          new_password[random_position] = missing_char;

          // 4. add the position to filled_optional_chars (mark as taken)
          filled_optional_chars.add(random_position);

          //   console.log(
          //     `R\replaced char at pos. ${random_position} with "${missing_char}" for set "${arg.arg_name}"`
          //   );

          // replacement is done, break the loop
          break;
        }
      }
    }
  });

  // back to string and return
  return new_password.join("");
}

let password_length = DEFAULT_PASSWORD_LENGTH;
let password_chars = DEFAULT_PASSWORD_CHARS;

console.log("\nPassword Generator CLI, ver." + APP_VERSION);

const passed_arguments = process.argv.slice(2).map((arg) => arg.toLowerCase());
analyze_program_arguments(passed_arguments);
console.log("(run with --help to see available options)\n");

console.log("---> password_length    ---> " + password_length + " characters");
const generated_password = generate_password(password_length, password_chars);
console.log("--->           password ---> " + generated_password);
const updated_password = ensure_optional_characters(generated_password);
console.log("---> generated password ---> " + updated_password);

process.exit(0);
