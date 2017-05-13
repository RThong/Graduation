var gulp = require('gulp');  
var browserSync = require('browser-sync').create();  
var reload = browserSync.reload; 
var nodemon = require('gulp-nodemon'); 

gulp.task('server', function() { 
    nodemon({ 
        script: './bin/www', 
        ignore: ["gulpfile.js", "node_modules/", "public/**/*.*"], 
        env: { 'NODE_ENV': 'development' } 
    })
    .on('start', function() { 
        var files = ["public/**/**", "views/**/**", "config/*.js"];

        browserSync.init({ 
            proxy: 'http://localhost:3000',
            files: files,
            browser: "chrome",
            port:8080 
        }, function() { 
            console.log("browser refreshed."); 
        }); 

        gulp.watch(files).on("change", function(event){
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    }); 
});

gulp.task('default', ['server']);