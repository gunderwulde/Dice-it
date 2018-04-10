module.exports = function(grunt) {

    // All upfront config goes in a massive nested object.
    grunt.initConfig({
      // You can set arbitrary key-value pairs.
      distFolder: 'dist',
      // You can also set the value of a key as parsed JSON.
      // Allows us to reference properties we declared in package.json.
      pkg: grunt.file.readJSON('package.json'),
      // Grunt tasks are associated with specific properties.
      // these names generally match their npm package name.
      concat: {
        // Specify some options, usually specific to each plugin.
        options: {
          // Specifies string to be inserted between concatenated files.
          separator: ';'
        },
        // 'dist' is what is called a "target."
        // It's a way of specifying different sub-tasks or modes.
        dist: {
          // The files to concatenate:
          // Notice the wildcard, which is automatically expanded.
          src: ['Lib/*.js', 'Main.js'],
          // The destination file:
          // Notice the angle-bracketed ERB-like templating,
          // which allows you to reference other properties.
          // This is equivalent to 'dist/main.js'.
          dest: 'concat.main.js'
          // You can reference any grunt config property you want.
          // Ex: '<%= concat.options.separator %>' instead of ';'
        }
      },
      uglify: {
        options: {
          // the banner is inserted at the top of the output
          banner: '/*! main <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          files: {
            'main.min.js': ['<%= concat.dist.dest %>']
          }
        }
      }
    }); // The end of grunt.initConfig
  
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
  
    // Register our own custom task alias.
    grunt.registerTask('build', ['concat', 'uglify']);
  };