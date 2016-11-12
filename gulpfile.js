const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const notify = require('gulp-notify');
const del = require('del');
const minifycss = require('gulp-clean-css');
const concat = require('gulp-concat');
const less = require('gulp-less');

const browserSync = require('browser-sync');

const entry = './src/index.js';
const index = './src/index.html';

const cssSrc = './src/css/*.*';
const fontSrc = './src/fonts/*.*';
const libSrc = './src/lib/';

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 开发环境目录配置 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
const dev = {
    dir: './development/',
    index: './development/index.html',
    js: './development/js/',
    css: './development/css/',
    img: './development/img/',
    font: './development/fonts/',
};
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 发布环境目录配置 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
const dist = {
    dir: './dist/',
    index: './dist/index.html',
    js: './dist/js/',
    css: './dist/css/',
    img: './dist/img/',
    font: './dist/fonts/',
};

//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 开发环境目录配置 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ javascript任务，转化jsx并用babel转码es2015 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
const bf = browserify({
    entries: entry,
    cache: {},
    packageCache: {},
    plugin: [watchify]
}).transform('babelify', {
    presets: ['react', 'es2015', 'stage-0']
});

bf.on('update', () => {
    gulp.start('javascript');
});

gulp.task('javascript', /*['cleanJs'],*/ () => {
    return bf.bundle()
        .on('error', function(e) {
            console.log('ERROR::', e.message);
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(dev.js))
        .pipe(uglify())
        .pipe(gulp.dest(dist.js))
        .pipe(notify('javascript task done !'));
});
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ javascript任务，转化jsx并用babel转码es2015 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

gulp.task('lib', () =>
    gulp.src([libSrc + 'jquery.js', libSrc + 'metro.js'])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(dev.js))
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(dist.js))
    .pipe(notify('lib task done!'))
);

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ html任务 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
gulp.task('html', () =>
    gulp.src(index)
    .pipe(gulp.dest(dev.dir))
    .pipe(notify('html task done !'))
);
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ html任务 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ fonts任务,一次性 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// gulp.task('font', () =>
// gulp.src(fontSrc)
//     .pipe(gulp.dest(dev.font))
//     .pipe(notify('font task done !'))
// );
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ fonts任务,一次性 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ css任务 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
gulp.task('css', /* ['cleanCss'],*/ () =>
    gulp.src(cssSrc)
    .pipe(concat('app.css'))
    .pipe(less())
    .pipe(gulp.dest(dev.css))
    .pipe(minifycss())
    .pipe(gulp.dest(dist.css))
    .pipe(notify('less/css task done !'))
);
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ css任务 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ copy任务 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// gulp.task('copy', function(){
// 	return gulp.src(dev.dir + '**/*')
// 		.pipe(gulp.dest('./dist/'));
// });
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ copy任务 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 浏览器同步及刷新任务 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
gulp.task('liveSync', () => {
    browserSync.init({
        server: {
            baseDir: dev.dir
        }
    });

    gulp.watch(dev.dir + '**/*.*', browserSync.reload);
});
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 浏览器同步及刷新任务 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ watch任务 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
gulp.task('watch', function() {
    gulp.watch(index, ['html']);
    gulp.watch(cssSrc, ['css']);
    // gulp.watch(dev.dir + '*', ['copy']);
});
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ watch任务 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

gulp.task('default', ['html', 'css', 'javascript', 'liveSync', 'watch']);
