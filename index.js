const process = require("process");

const APP_VERSION = "0.0.1";
const DEFAULT_PASSWORD_CHARS = "abcdefghijklmnopqrstuvwxyz";
const DEFAULT_PASSWORD_LENGTH = 8;

function generate_password(password_length, password_valid_chars) {
  let new_password = "";

  while (new_password.length < password_length) {
    const char = password_valid_chars.charAt(
      Math.floor(Math.random() * password_valid_chars.length)
    );
    new_password += char;
  }
  return new_password;
}

console.log("\nPassword Generator CLI, ver." + APP_VERSION + "\n");

const passed_arguments = process.argv.slice(2);
let password_length = DEFAULT_PASSWORD_LENGTH;
let password_chars = DEFAULT_PASSWORD_CHARS;

const generated_password = generate_password(password_length, password_chars);
console.log("---> generated password ---> " + generated_password);

process.exit(0);
