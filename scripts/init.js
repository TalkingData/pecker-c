/**
 * init dep
 */
const shell = require("shelljs");
module.exports = function() {
  if (shell.which("node")) {
    shell.cd("src/app");
    shell.echo("Install dependencies for app...");
    shell.exec("npm i");
    shell.echo("Next...");
    shell.cd("../service");
    shell.echo("Install dependencies for service...");
    shell.exec("npm i");
    shell.echo(
      'Dependent installation success.You can now use "npm run pecker:start" to use the program.'
    );
    shell.exit();
  }
};
