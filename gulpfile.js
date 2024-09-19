const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const order = require('gulp-order');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const combineMediaQuery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const path = require('path');
const fsExtra = require('fs-extra');
const fs = require('fs');
const { promisify } = require('util');

const rmdir = promisify(fs.rm);

// Очистка папки dist
gulp.task('clean', () => {
    return rmdir('dist', { recursive: true, force: true });
});

// Обработка CSS
gulp.task('css', () => {
    const plugins = [
        autoprefixer(),
        combineMediaQuery(),
        cssnano()
    ];

    return gulp.src(['src/styles/**/*.css', 'src/blocks/**/*.css'])
        .pipe(plumber())
        .pipe(order([
            'src/styles/**/*.css',
            'src/blocks/**/*.css'
        ]))
        .pipe(replace(/url\(['"]?\.\//g, 'url(../images/'))
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.stream());
});

// Обработка JS
gulp.task('js', () => {
    return gulp.src(['src/scripts/**/*.js', 'src/blocks/**/*.js'])
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
});

// Обработка изображений
gulp.task('images', (done) => {
  const srcPaths = ['src/images/**/*', 'src/blocks/**/*.{png,jpg,jpeg,gif,svg}'];
  const destPath = 'dist/images';

  // Убеждаемся, что папка назначения существует
  fsExtra.ensureDirSync(destPath);

  gulp.src(srcPaths, { read: false })
      .on('data', function(file) {
          const fileName = path.basename(file.path);
          const destFilePath = path.join(destPath, fileName);
          fsExtra.copy(file.path, destFilePath, err => {
              if (err) console.error(`Error copying ${file.path}: ${err}`);
          });
      })
      .on('end', done);
});

// Обработка HTML
gulp.task('html', () => {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

// Копирование шрифтов
gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

// Запуск сервера
gulp.task('serve', () => {
    browserSync.init({
        server: './dist'
    });

    gulp.watch('src/**/*.css', gulp.series('css'));
    gulp.watch('src/**/*.js', gulp.series('js'));
    gulp.watch('src/**/*.{png,jpg,jpeg,gif,svg}', gulp.series('images'));
    gulp.watch('src/*.html', gulp.series('html'));
    gulp.watch('src/fonts/**/*', gulp.series('fonts'));
});

// Сборка проекта
gulp.task('build', gulp.series('clean', gulp.parallel('css', 'js', 'images', 'html', 'fonts')));

// Задача по умолчанию
gulp.task('default', gulp.series('build', 'serve'));