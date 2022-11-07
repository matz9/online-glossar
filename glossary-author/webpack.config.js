const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const FAVICON = 'src/favicon.ico';

/**
 * The constant `SERVER_BASE_URL` determines how the file `context.jsc` is loaded in runtime.
 *
 * On a productive system, this front end is integrated in the WAR file `online-glossary.war` and is deployed
 * together with the back-end in the same Tomcat instance. Therefor the file `context.jsc` is loaded in this case
 * via a relative path to the file.
 *
 * On a development, there are to situation. The first one is, the stable back-end runs on a remote server
 * (e.g `markov.htwsaar.de`) and the front-end just has to talk to the remove server.
 * In this case the file `context.jsc` is loaded from the remote server via an absolute https-URL
 * (https://markov.htwsaar.de/online-glossary/context.jsc). The second situation
 * is, the front-end use an experimental instance of online glossary on localhost. In this case the file `context.jsc`
 * is loaded via an absolute http-URL (http://localhost:8080/online-glossary/context.jsc).
 *
 *
 * This construct is necessary for some reasons:
 *
 * + On a productive deployment, there is no CORS Trouble, since back-end and front end run on the same origin.
 * + When the API becomes stable, the front-end developer just have to write code against the API from a remote test server,
 * but does not have to deploy a tomcat instance on localhost. It saves time and stress.
 *
 * This vaiable is controlled by package.json.
 * */
module.exports = (options = {}) => {
    const SERVER_BASE_URL = options.SERVER === 'markov'
        ? "https://markov.htwsaar.de/online-glossary"
        : "http://localhost:8080/online-glossary" ;
    return {
        entry: {
            author:    "./src/author/author.js",
            /*customer: "./src/customer/main.js"*/
            lecture_effort: "./src/lecture-effort.js"
        },
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: '[name]/[name].[chunkhash].js'
        },
        module: {
            rules: [
                {
                    test: /\.(css)/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                }
            ]
        },

        plugins: [
            // SERVER_BASE_URL_STR wird in den HTML-Templates vom HtmlWebpackPlugin verwendet
            new webpack.DefinePlugin({
                'SERVER_BASE_URL_STR': options.dev ? JSON.stringify(SERVER_BASE_URL) : 'null'
            }),

            // extract CSS to separate file as build
            new MiniCssExtractPlugin(),

            // index page
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                favicon: FAVICON
            }),

            // Ein eigenständiges Bundle für jeden größeren Bereich des Frontends
            new HtmlWebpackPlugin({
                template: 'src/author.html',
                filename: 'author.html',
                chunks: ['author'],
                favicon: FAVICON
            }),

            new HtmlWebpackPlugin({
                template: 'src/lecture-effort.html',
                filename: 'lecture-effort.html',
                chunks: ['lecture_effort'],
                favicon: FAVICON
            }),

        ],

        /* Webpackage dev Server config
         z.B. http://127.0.0.1:8010/assets/admin.html
         */
        devServer: {
            host: '127.0.0.1',
            port: 1234,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        },
    };
};
