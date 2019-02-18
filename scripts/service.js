/**
 * run service
 */
const shell = require("shelljs");
module.exports = (function() {
  if (shell.which("node")) {
    shell.cd("src/service");
    shell.echo("Start service...");
    shell.exec("npm run tsc");
    shell.exec("npm run start:db & npm start");
    shell.echo("Service is running...");
    shell.exit();
  }
})();
