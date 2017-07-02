
var gulp         = require('gulp'),
    _            = require('underscore'),
    browserify   = require('browserify'),
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    jade         = require('gulp-jade'),
    sass         = require('gulp-sass'),
    file         = require('gulp-file'),
    path         = require('path'),
    runSequence  = require('run-sequence'),
    sassify      = require('sassify'),
    minCss       = require('gulp-clean-css'),
    uglify       = require('gulp-uglify'),
    compass      = require('compass-importer'),
    sourcemaps   = require('gulp-sourcemaps'),
    browserSync  = require('browser-sync').create(),
    sprintf      = require('underscore.string/sprintf'),
    plumber      = require('gulp-plumber'), // Prevent pipe breaking caused by errors from gulp plugins
    concat       = require('gulp-concat'),
    concatStream = require('concat-stream'),
    watch        = require('gulp-watch'),
    bless        = require('gulp-bless'); // More reliable watch

// FOR FAST DEV: RECOMPILING ONLY THE WIP FILE

specificRecompile = [
    // { feed:'ingresso-modification', jade:'ingresso-modification'},
    // { feed:'hotel--lengs', jade:'hotel-property--lengs'},
    // { feed:'hotel--lengs', jade:'hotel-property-lengs-social'},
    // { feed:'checkout-modification', jade:'checkout-modification'},
    // { feed:'checkout', jade:'checkout-demo'},
    // { feed:'checkout', jade:'checkout-demo'},
    // { feed:'city-main', jade:'city-main'},
    // { feed:'checkout-2.0', jade:'checkout2.0-step2'},
    // { feed:'default', jade: 'index'},
    // { feed:'hotel', jade:'hotel-property'},
    // { feed:['hotel', 'maps-hotelproperty'], jade:'hotel-property'},
    // { feed:'hotels', jade:'hotels'},
    // { feed:'ugc-competition', jade:'ugc-competition'},
    // { feed:'hotel-offers', jade:'hotel-offers'},
    // { feed:'hotel-landing', jade:'hotel-landing'},
    // { feed:'signup', jade:'signup'},
    // { feed:'booking-customize', jade:'booking-customize'},
    // { feed:'account-management', jade:'account-management'},
    // { feed:'forgot-password', jade:'forgot-password'},
    // { feed:'scratchpad', jade:'scratchpad'},
    // { feed:'maps', jade:'maps-demo-location'},
    // { feed:'maps', jade:'maps-demo-destination'},
    // { feed:'maps-neighborhood', jade:'maps-demo-neighborhood'},
    // { feed:['maps-attraction', 'maps-gallery'], jade:'maps-demo-attraction'},
    // { feed:'maps-blog', jade:'maps-demo-blog'},
    // { feed:'maps', jade:'maps-demo'},
    // { feed:'business-direct', jade:'business-direct'},
    // { feed:'resetpassword', jade:'resetpassword'},
    // { feed:'layout-pp3', jade:'layout-pp3'},
    // { feed:'meetings', jade:'meeting-main'},
    // { feed:'meetings-rfp', jade:'meeting-proposal'},
    // { feed:'default', jade:'meeting-property'},
    // { feed:'default', jade:'template-demo'},
    // { feed:'offers-main', jade:'offers-main'},
    // { feed:'offers-details', jade:'offers-details'},
    // { feed:'pricing-main', jade:'pricing-main'},
    // { feed:'pricing-details', jade:'pricing-details'},
    // { feed:'weddings', jade:'weddings-main'},
    // { feed:'weddings-rfp', jade:'wedding-proposal'},
    // { feed:'weddings-brochure', jade:'wedding-brochure'},
    // { feed:'tours-main', jade:'tours-main'},
    // { feed:'gifts-main', jade:'gifts-main'},
    // { feed:'gifts-detail', jade:'gifts-detail'},
    // { feed:'travel-preferences', jade:'travel-preferences'},
    // { feed:'feedback-enquiry', jade:'feedback-enquiry'},
    // { feed:'blog', jade:'blog'},
    // { feed:'blog-comment', jade:'blog-post'},
    // { feed:'wechat-signIn',jade:'wechat-signIn', quickbook: true},
    // { feed:'quick-book-main',jade:'quick-book-main', quickbook: true},
    // { feed:'quick-book-hotel', jade:'quick-book-hotel', quickbook: true},
    // { feed:'quick-book-main',jade:'quick-book-main', quickbook: true},
    // { feed:'quick-book-city', jade:'quick-book-city', quickbook: true},
    // { feed:'dining', jade:'dining'},
    // { feed:'bestrate-guarantee', jade:'investor-relations-bestrate-guarantee'},
    // { feed:'careers2.0', jade:'careers2.0'},
    // { feed:'careers-detail2.0', jade:'careers-detail2.0'},

    // { feed:'meetings-landing', jade:'meeting-main'},
    // { feed:'meeting-property', jade : 'mice-hotel'},
    // { feed:'meetings-city', jade:'meeting-city'},
    // { feed:'meeting-event', jade : 'mice-event'},

    // { feed:'default', jade:'template-demo'},
    // { feed:'dining-detail', jade:'dining-detail'}
    // { feed:'global-search-widget',jade:'global-search-widget'},
    // { feed:'booking-2.0',jade:'global-booking-widget-prop'}
    // { feed:'hotels-collections2.0',jade:'hotels-brands-landing-page'}
]
    ,
    svgSprite = require("gulp-svg-sprite")
;

var hasQuickbook = !specificRecompile.length || _.some(specificRecompile, function (feed) {
        return feed.quickbook;
    });

var hasNormalFeed = !specificRecompile.length || _.some(specificRecompile, function (feed) {
        return !feed.quickbook;
    });

function getBundleFiles(src) {
    var fs = require("fs");
    if (fs.existsSync(src)) {
        return fs.readdirSync(src);
    }
    return null;
}

function buildBundleFeeds(bundleFiles, src, dest) {
    var fs = {};
    for (var f in bundleFiles) {
        fs[src + bundleFiles[f]] = dest + bundleFiles[f];
    }
    return fs;
}

gulp.task("bundle", function () {
    var feedDir = "./src/module/feed/";
    var feedDes = "./build/bundle/";
    var fs      = require("fs");
    if (!fs.existsSync(feedDes)) {
        fs.mkdirSync(feedDes, 0777)
    }
    var opts = {
        //Put your feeds here (feeds are entries javascript for page)
        "feeds": buildBundleFeeds(getBundleFiles(feedDir), feedDir, feedDes),
        "debug": true,
        "external": 'jquery'
    };

    // Specific Recompile - for fast DEV
    if (specificRecompile.length) {
        var defaultJs = [];

        if (hasQuickbook) {
            defaultJs.push('default-quick-book');
        }
        if (hasNormalFeed) {
            defaultJs.push('default');
        }
        opts.feeds = _.reduce(defaultJs.concat(_.flatten(_.pluck(specificRecompile, 'feed'))), function (hash, key) {
            hash[sprintf('./src/module/feed/%s.js', key)] = sprintf('./build/bundle/%s.js', key);
            return hash;
        }, {});
    }

    browserify(_.keys(opts.feeds), opts)
        .transform(sassify, {
            'auto-inject': true, // Inject css directly in the code
            base64Encode: !!specificRecompile.length, // Use base64 to
            // inject css
            sourceMap: true
        })
        .plugin('factor-bundle', { outputs: _.values(opts.feeds) })
        .bundle()
        .pipe(plumber())
        .pipe(source('common.js'))
        .pipe(gulp.dest(feedDes));

});

gulp.task("concatenate_js", function () {
    gulp.src(['./prod/assets/lib/exlibs.min.js'].concat(_.map(['common.js', 'default.js', 'footer.js', 'lazyloadcss.js'], function (feed) {
        return './prod/bundle/' + feed;
    }))).pipe(concat('bundle.js')).pipe(gulp.dest('./prod/bundle/'));
});

gulp.task("prod_begin", function () {
    gulp.src("./src/config/prod/host.js")
        .pipe(gulp.dest("./src/config/"));
});

gulp.task("bundle_prod", function () {
    var feedDir = "./src/module/feed/";
    var feedDes = "./prod/bundle/";
    var fs      = require("fs");
    if (!fs.existsSync(feedDes)) {
        fs.mkdirSync(feedDes, 0777)
    }
    var opts = {
        //Put your feeds here (feeds are entries javascript for page)
        "feeds": buildBundleFeeds(getBundleFiles(feedDir), feedDir, feedDes),
        "debug": false
    };

    // To uglify the feeds with a streaming manner
    function write(filepath) {
        return concatStream(function (content) {
            // create new vinyl file from content and use the basename of the
            // filepath in scope as its basename.
            return file(path.basename(filepath), content, { src: true }).pipe(plumber())
                .pipe(buffer())
                .pipe(uglify({
                    compress: {
                        drop_debugger: true
                    }
                }))
                .pipe(gulp.dest(feedDes));
        });
    }

    browserify(_.keys(opts.feeds), opts)
        .transform(sassify, {
            'auto-inject': true, // Inject css directly in the code
            base64Encode: false, // Use base64 to inject css
            sourceMap: false
        })
        .plugin('factor-bundle', { outputs: _.map(_.values(opts.feeds), write) })
        .bundle()
        .pipe(plumber())
        .pipe(write('common.js'));

});

gulp.task("bundle_dev", function () {
    var feedDir = "./src/module/feed/";
    var feedDes = "./prod/bundle/";
    var fs      = require("fs");
    if (!fs.existsSync(feedDes)) {
        fs.mkdirSync(feedDes, 0777)
    }
    var opts = {
        //Put your feeds here (feeds are entries javascript for page)
        "feeds": buildBundleFeeds(getBundleFiles(feedDir), feedDir, feedDes),
        "debug": false
    };

    browserify(_.keys(opts.feeds), opts)
        .transform(sassify, {
            'auto-inject': true, // Inject css directly in the code
            base64Encode: false, // Use base64 to inject css
            sourceMap: true
        })
        .plugin('factor-bundle', { outputs: _.values(opts.feeds) })
        .bundle()
        .pipe(plumber())
        .pipe(source('common.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .pipe(gulp.dest(feedDes));
});

gulp.task("prod_end", function () {
    gulp.src("./src/config/dev/host.js")
        .pipe(gulp.dest("./src/config/"));
});

gulp.task("styles", function () {

    gulp.src("./src/assets/style/fonts/*.*")
        .pipe(gulp.dest("./build/assets/style/fonts/"));


    var cssFiles = [];

    if (hasQuickbook) {
        cssFiles.push('./src/assets/style/default-quick-book.sass');
    }
    if (hasNormalFeed) {
        cssFiles = cssFiles.concat(['./src/assets/style/homepage.sass', './src/assets/style/new-booking.sass', './src/assets/style/default-attraction.sass']);

        // Added css blessing for the biggest sass to produce split files for IE
        gulp.src(['./src/assets/style/default-all.sass'])
            .pipe(plumber())
            .pipe(sass({ includePaths: '.compass/compass-mixins-master/lib' }))
            .pipe(bless())
            .pipe(minCss({ compatibility: 'ie9', inline: ['none'] }))
            .pipe(gulp.dest('./build/assets/style/'));

    }

    gulp.src(cssFiles)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: '.compass/compass-mixins-master/lib' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/assets/style/'));
});

gulp.task("styles_prod", function () {

    gulp.src("./src/assets/style/fonts/*.*")
        .pipe(gulp.dest("./prod/assets/style/fonts/"))
        .pipe(gulp.dest("./prod/assets/style/ie/fonts/"));

    gulp.src(['./src/assets/style/homepage.sass', './src/assets/style/new-booking.sass',
        './src/assets/style/default-all.sass',
        './src/assets/style/default-quick-book.sass', './src/assets/style/default-attraction.sass'])
        .pipe(plumber())
        .pipe(sass({ includePaths: '.compass/compass-mixins-master/lib' }))
        .pipe(minCss({ compatibility: 'ie9', inline: ['none'] }))
        .pipe(gulp.dest('./prod/assets/style/'));

    // Added css blessing for the biggest sass to produce split files for IE
    gulp.src(['./src/assets/style/default-all.sass'])
        .pipe(plumber())
        .pipe(sass({ includePaths: '.compass/compass-mixins-master/lib' }))
        .pipe(bless())
        .pipe(minCss({ compatibility: 'ie9', inline: ['none'] }))
        .pipe(gulp.dest('./prod/assets/style/ie/'));

});

gulp.task("jade", function () {
    var feeds = specificRecompile.length ? _.map(specificRecompile, function (feed) {
        return sprintf('./src/page/%s.jade', feed.jade);
    }) : ['./src/page/*.jade'];

    return gulp.src(feeds)
        .pipe(plumber())
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest('./build/'))
});


gulp.task("local", function () {
    return gulp.src(['./src/assets/local/**/*.*'])
        .pipe(gulp.dest('./build/assets/local'))
});

gulp.task("lib", function () {
    return gulp.src(['./src/assets/lib/**/*.*'])
        .pipe(gulp.dest('./build/assets/lib'))
});

gulp.task("lib_prod", function () {
    return gulp.src(['./src/assets/lib/**/*.*'])
        .pipe(gulp.dest('./prod/assets/lib'))
});

gulp.task("image", function () {
    return gulp.src(['./src/assets/img/**/*.*'])
        .pipe(gulp.dest('./build/assets/img'))
});

gulp.task("image_prod", function () {
    return gulp.src(['./src/assets/img/**/*.*'])
        .pipe(gulp.dest('./prod/assets/img'))
});

gulp.task("data", function () {
    return gulp.src(['./src/data/**/*.*'])
        .pipe(gulp.dest('./build/data/'))
});

gulp.task("svg", function () {
    return gulp.src(["./src/assets/img/flags/*.svg"])
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite/sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest("./build/assets/img/flags"));
});
gulp.task("svg_prod", function () {
    return gulp.src(["./src/assets/img/flags/*.svg"])
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite/sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest("./prod/assets/img/flags"));
});

gulp.task("watch", function () {
    // var proxy = require('proxy-middleware'), url = require('url');
    browserSync.init({
        files: "./build/**",
        reloadDelay: 2000,
        reloadDebounce: 5000,
        open: false,
        server: {
            baseDir: "./build",
            directory: true,
            //middleware: [proxy(_.extend(url.parse('http://10.148.60.55/api'),{route:'/api'}))]
        }
    });

    gulp.watch('./src/data/**/*', ['data']);
    gulp.watch('./src/config/**/*', ['bundle']);
    gulp.watch('./src/module/**/*.js', ['bundle']);
    gulp.watch('./src/module/**/*.hbs', ['bundle']);
    gulp.watch('./src/assets/style/**/*', ['styles']);
    gulp.watch('./src/page/**/*', ['jade']);
    gulp.watch('./src/module/**/*.sass', ['styles', 'bundle']);

});


gulp.task("watch_no_browserSync", function () {

    gulp.watch('./src/data/**/*', ['data']);
    gulp.watch('./src/config/**/*', ['bundle']);
    gulp.watch('./src/module/**/*.js', ['bundle']);
    gulp.watch('./src/module/**/*.hbs', ['bundle']);
    gulp.watch('./src/assets/style/**/*', ['styles']);
    gulp.watch('./src/page/**/*', ['jade']);
    gulp.watch('./src/module/**/*.sass', ['styles', 'bundle']);

});

gulp.task('quick-build-watch', ['bundle', 'styles', 'jade', 'watch']);
gulp.task("no-watch", function () {
    browserSync.init({
        files: "./build/**",
        reloadDelay: 2000,
        reloadDebounce: 5000,
        open: false,
        server: {
            baseDir: "./build",
            directory: true,
            //      middleware: [proxy(_.extend(url.parse('http://10.148.60.55/api'),{route:'/api'}))]
        }
    });
});

gulp.task('build', ['bundle', 'styles', 'jade', 'lib', 'local', 'image', 'data', 'svg']);
gulp.task('build-watch', ['bundle', 'styles', 'jade', 'lib', 'local', 'image', 'data', 'svg'], function () {
    "use strict";
    runSequence('watch');
});
gulp.task('prod', ['bundle_prod', 'styles_prod', 'lib_prod', 'image_prod', 'svg_prod']);
gulp.task('dev', ['bundle_dev', 'styles_prod', 'lib_prod', 'image_prod', 'svg_prod']);


var minimist     = require('minimist');
var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
};

var options = minimist(process.argv.slice(2), knownOptions);
gulp.task('dev-server', function () {
    (options.env === 'dev') ? runSequence('prod_begin', 'dev', 'concatenate_js', 'prod_end') : runSequence('prod_begin', 'prod', 'prod_end')
});
