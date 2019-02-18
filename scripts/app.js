/**
 * run app
 */
const shell = require("shelljs");
module.exports = (function() {
  if (shell.which("node")) {
    shell.cd("src/app");
    shell.echo("Start app...");
    shell.exec("npm start");
    shell.echo(
      "Now you can visit http://localhost:9000 and use the cloud front-end monitoring system."
    );
    shell.exit();
  }
})();
