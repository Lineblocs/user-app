module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"
    src_path: "src"
    coffee:
      compile:
        files:
          "dist/<%= pkg.name %>.js": ["<%= src_path %>/directives/*.coffee"]
    uglify:
      options:
        mangle: false
      target:
        files:
          "dist/<%= pkg.name %>.min.js": ["dist/<%= pkg.name %>.js"]
  
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  grunt.registerTask "default", ["coffee","uglify"]
