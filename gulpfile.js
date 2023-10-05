"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

const dist = "./dist/";

// задача для того, чтобы отслеживать изменения, которые мы вносим в html-файл
// копируем код из папки src/index.html
// перемещаем его в папку dist
// запускаем browsersync для того, чтобы страница обновилась
gulp.task("copy-html", () => {
    return gulp.src("./src/index.html")
                .pipe(gulp.dest(dist))
                .pipe(browsersync.stream());
});

// таск по компиляции скриптов
// 
gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                // здесь уже пользуемся вебпэком 
                // в вебпэке есть два вида компиляции - режим разработки и режим продакшена
                .pipe(webpack({
                    // компиляция в режиме разработки
                    mode: 'development',
                    // устанавливаем, куда у нас будут складываться файлы и название файла
                    output: {
                        filename: 'script.js'
                    },
                    // параметр watch отключаем, т.к. за это у нас будет отвечать отдельная задача
                    watch: false,
                    // подключаем source-map, это по факту карта проекта, откуда скрипты идут и из каких кусочков состоят
                    devtool: "source-map",
                    // подключаемый модуль
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              // подключаем babel
                              loader: 'babel-loader',
                              options: {
                                // подключаемый самый классический пресет
                                presets: [['@babel/preset-env', {
                                    // подключаем дебаг, чтобы в случае возникновения каких-то проблем в консоль вывелись ошибки
                                    debug: true,
                                    // подключаем 3-ю версию core.js
                                    // она нужна для работы с полифилами - кодом, написанным в старом стандарте
                                    // для того, чтобы заместить определенные фичи, которых нет в старых браузерах
                                    corejs: 3,
                                    // когда проект компилируется, эта библиотека анализирует весь код, смотри browserlist, который мы поддерживаем
                                    // и использует только те полифилы, которые действительно необходимы в нашем проекте
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                // берем получшившийся после всех этих манипуляций файл и отправляем его в папку dist
                .pipe(gulp.dest(dist))
                // если были изменения - перезагружаем страницу
                .on("end", browsersync.reload);
});

// из папки src/assets берем любые файлы на любом уровне вложенности (в любых папках)
// копируем все в папку dist/assets
// после этого перезагружаем страницу
gulp.task("copy-assets", () => {
    return gulp.src("./src/assets/**/*.*")
                .pipe(gulp.dest(dist + "/assets"))
                .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    // внутри таска watch запускается отдельный сервер, который работает при помощи browsersync
    browsersync.init({
    // он серверит файлы, которые находятся в папке dist
		server: "./dist/",
		port: 4000,
		notify: true
    });
    
    // запускаем gulp.watch, чтобы галп следил за отдельными файлами
    // к примеру, если что-то поменялось в файле index.html, запускаем в параллель таск copy-html
    gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    // если любой произойдут имзенения в любом из файлов в папке js - запустится команда build-js
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

// это все были задачи, которые отслеживают изменения, но когда мы просто запускаем галп в первый раз
// у нас файлы не меняются, а некоторые разработчики могут внести правки в файлы еще до того
// как запускают галп
// поэтому нам также понадобится таск, который называется build
// который параллельно запускает все три задачи

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-js"));

// build-prod-js делает похожие вещи, но уже в чистовом варианте для прода
gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

// задача, которая запускается по умолчанию, ее можно запустить командной gulp
// здесь параллельно запускаем сразу две задачи
// во-первых, build - чтобы все файлы скомпилировались (на случай, если были внесены изменения до запуска галпа)
// во-вторых, watch - для того, чтобы отслеживать в будущем все изменения 
gulp.task("default", gulp.parallel("watch", "build"));