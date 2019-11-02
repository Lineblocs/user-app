
var mergeTemplates = require('./merge_templates.js');
var fs = require("fs");
mergeTemplates().then(function(output) {
        fs.writeFileSync("./app/templates.html", output);
    });

