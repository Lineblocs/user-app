var glob = require('glob');
var fs= require('fs');

function doMerge() {
  return new Promise(function(resolve, reject) {
    // options is optional
    var areas = [
      './app/views/*.html',
      './app/views/dialogs/*.html',
      './app/views/layouts/*.html',
      './app/views/pages/*.html',
      './app/views/pages/dashboard/*.html',
      './app/views/pages/did/*.html'
    ];
    var promises = [];
    areas.forEach(function(area) {
      promises.push(new Promise(function(resolve, reject) {
        glob(area, {}, function (er, files) {
          if ( er ) { 
            reject( er ); 
            return;
          }
          // files is an array of filenames.
          // If the `nonull` option is set, and nothing
          // was found, then files is ["**/*.js"]
          // er is an error object or null.
          console.log("files are ", files);
          resolve(files);
        })
      }));
    });
      Promise.all( promises ).then(function(files) {
          var merged = [].concat.apply([], files); 
          console.log("merged files are ", merged);
          var output = "";
          merged.forEach(function(file) {
            var id = file.replace('./app/views/', 'views/');
            console.log("creating template ", id);
            var fileUrl = new URL('file://' + file);

            var contents = fs.readFileSync(file);
            var template = `<script type="text/ng-template" id="${id}">
              ${contents} 
            </script>`;
            console.log("template is ", template);
            output = output + template + "\n";
          }); 
          resolve(output);
          //fs.writeFileSync("./templates.html", output);
      });
  });
}
module.exports = doMerge;

