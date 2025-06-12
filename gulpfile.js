// const { src, dest, watch, series } = require('gulp');

// // CSS y SASS
// const sass = require('gulp-sass')(require('sass'));
// const postcss = require('gulp-postcss');
// const autoprefixer = require('autoprefixer');
// const sourcemaps = require('gulp-sourcemaps');
// const cssnano = require('cssnano');

// // Imagenes
// const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');
// const avif = require('gulp-avif');

// function css( done ) {
//     src('src/scss/app.scss')
//         .pipe( sourcemaps.init() )
//         .pipe( sass() )
//         .pipe( postcss([ autoprefixer(), cssnano() ]) )
//         .pipe( sourcemaps.write('.'))
//         .pipe( dest('build/css') )

//     done();
// }

// function imagenes() {
//     return src('src/img/**/*')
//         .pipe( imagemin({ optimizationLevel: 3 }) )
//         .pipe( dest('build/img') )
// }

// function versionWebp() {
//     const opciones = {
//         quality: 50
//     }
//     return src('src/img/**/*.{png,jpg}')
//         .pipe( webp( opciones ) )
//         .pipe( dest('build/img') )
// }
// function versionAvif() {
//     const opciones = {
//         quality: 50
//     }
//     return src('src/img/**/*.{png,jpg}')
//         .pipe( avif( opciones ) )
//         .pipe( dest('build/img'))
// }

// function dev() {
//     watch( 'src/scss/**/*.scss', css );
//     watch( 'src/img/**/*', imagenes );
// }


// exports.css = css;
// exports.dev = dev;
// exports.imagenes = imagenes;
// exports.versionWebp = versionWebp;
// exports.versionAvif = versionAvif;
// exports.default = series( imagenes, versionWebp, versionAvif, css, dev  );


import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';

import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

import browserSyncLib from 'browser-sync';

const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);
const { src, dest, watch, series } = gulp;

export function css(done) {
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
        .pipe(browserSync.stream());
    done();
}

export function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}

export function versionWebp() {
    const opciones = { quality: 50 };
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
}

export function versionAvif() {
    const opciones = { quality: 50 };
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
}

export function servidor(done) {
    browserSync.init({
        server: {
            baseDir: './'
        },
        notify: false,
        open: true
    });
    done();
}

export function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', series(imagenes, versionWebp, versionAvif)).on('change', browserSync.reload);
    watch('./*.html').on('change', browserSync.reload);
    watch('./build/js/**/*.js').on('change', browserSync.reload);
}

// Export por defecto
export const build = series(imagenes, versionWebp, versionAvif, css);
