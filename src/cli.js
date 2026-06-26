const metrics = require("./metrics");
const generateReport = require("./reports");
const exportCSV = require("./export");

console.log(
  generateReport(metrics)
);

console.log();

console.log(
  exportCSV(metrics)
);