const express = require("express");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const CUTOFF = 90;

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.lhr)
    });
  });
}

const app = express();
app.use(express.static("build"));
const server = app.listen(5000, function() {
  const port = server.address().port;
  console.log("Server started at http://localhost:%s", port);

  launchChromeAndRunLighthouse("http://localhost:5000", { chromeFlags: ["--show-paint-rects"] }).then(results => {
    // this whole section doesn't work
    score = results.score;
    const catResults = results.categories.forEach(cat => {
      if (cat.score < CUTOFF) {
        cat.auditRefs.map(auditRef => {
          const audit = results.audits[auditRef.id];
          if (audit.weight < CUTOFF) {
            const result = audit.result;
            if (result.score) {
              console.warn(result.description + ": " + result.score);
            } else {
              console.warn(result.description);
            }
            if (result.displayValue) {
              console.log("Value: " + result.displayValue);
            }
            console.log(result.helpText);
            console.log(" ");
          }
        });
      }
      return cat;
    });
    catResults.forEach(cat => {
      console.log(cat.name, cat.score);
    });
    server.close();
  });
});
