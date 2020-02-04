const path = require('path');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// const TerserWebpackPlugin = require('terser-webpack-plugin')
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')


const config = {
    params: {
        isProduction: process.env.NODE_ENV === 'production'
    },
    pages: [
      'index',
      'ui',
    ],
    paths: {
        src: {
            entries: {
                app: './src/js/app.js',
                vendor: './src/js/vendor.js',
            },
            html: './src/html',
        },
        dist: {
            // html: 'html'
        }
    }
}

module.exports = {
    entry: {
        app: './src/js/app.js',
        vendor: './src/js/vendor.js',
    },
    output: {
        filename: config.params.isProduction ? 'js/[name].min.js' : 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: config.params.isProduction ? '' : 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    },
                    ...(!config.params.isProduction
                            ? [{
                                loader: 'eslint-loader',
                            }]
                            : []
                    )
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: !config.params.isProduction,
                            reloadAll: true,
                            publicPath: '../',
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts',
                },
            },
            {
                test: /\.(webp|png|jpe?g|gif|ico)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                    esModule: false,
                },
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: config.params.isProduction ? 'css/[name].min.css' : 'css/[name].[hash].css',
        }),
        ...config.pages.map((pageName) => {
            return new HTMLWebpackPlugin({
                filename: `${pageName}.html`,
                template: `./src/html/${pageName}.html`,
                inject: true,
                minify: {
                    ...config.params.isProduction ? [{
                        html5: true,
                        collapseWhitespace: true,
                        minifyCSS: true,
                        minifyJS: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributese: true,
                        useShortDoctype: true
                    }] : []
                }
            })
        })
    ],
    // optimization: {
    //     splitChunks: {
    //         chunks: "all"
    //     }
    // },
    devServer: {
        port: 4200,
        hot: !config.params.isProduction
    },
}

// module.exports = {
//     context: path.resolve(__dirname, 'src'),
//     mode: 'development',
//     entry: {
//         main: ['@babel/polyfill', './index.js'],
//         analytics: './analytics.js'
//     },
//     output: {
//         filename: filename('js'),
//         path: path.resolve(__dirname, 'dist')
//     },
//     resolve: {
//         extensions: ['.js', '.json', '.jpg'],
//         alias: {
//             '@models': path.resolve(__dirname, 'src/models'),
//             '@': path.resolve(__dirname, 'src')
//         },
//     },
//     optimization: optimization(),
//     devServer: {
//         port: 4200,
//         hot: isDev
//     },
//     devtool: isDev ? 'source-map' : '',
//     plugins: plugins(),
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 use: jsLoaders()
//             },
//             // https://www.youtube.com/watch?v=eSaF8NXeNsA&t=6608s c 2 ч 25 мин - тс и реакт
//             {
//                 test: /\.css$/,
//                 // use: [
//                 //     'style-loader',
//                 //     'css-loader'
//                 // ],
//                 use: cssLoaders()
//             },
//             {
//                 test: /\.s[ac]ss$/,
//                 use: cssLoaders('sass-loader')
//             },
//             {
//                 test: /\.(png|jpg|svg|gif)$/,
//                 use: [
//                     'file-loader'
//                 ]
//             },
//             {
//                 test: /\.(ttf|woff|woff2|eot)$/,
//                 use: [
//                     'file-loader'
//                 ]
//             },
//             {
//                 test: /\.xml$/,
//                 use: [
//                     'xml-loader'
//                 ]
//             },
//             {
//                 test: /\.csv$/,
//                 use: [
//                     'csv-loader'
//                 ]
//             }
//         ]
//     }
// }

// const isDev = process.env.NODE_ENV === 'development'
// const isProd = process.env.NODE_ENV === 'production'
//
// const optimization = () => {
//     const config = {
//         splitChunks: {
//             chunks: "all"
//         }
//     }
//
//     if(isProd) {
//         config.minimizer = [
//             new OptimizeCssAssetsWebpackPlugin(),
//             new TerserWebpackPlugin
//         ]
//     }
//
//     return config
// }
//
// const filename = ext => isDev ? `[name].${ext}` : `[name][hash].${ext}`
//
// const cssLoaders = extra => {
//     const loaders = [{
//         loader: MiniCssExtractPlugin.loader,
//         options: {
//             hmr: isDev,
//             reloadAll: true
//         }
//     },
//         'css-loader'
//     ]
//
//     if(extra){
//         loaders.push(extra)
//     }
//
//     return loaders
// }
//
// const jsLoaders = () => {
//     const loaders = [{
//         loader: 'babel-loader',
//         options: {
//             presets: [
//                 '@babel/preset-env'
//             ],
//             plugins: [
//                 '@babel/plugin-proposal-class-properties'
//             ]
//         }
//     }]
//
//     if(isDev){
//         loaders.push('eslint-loader')
//     }
//
//     return loaders
// }
//
// const plugins = () => {
//     const base = [
//         new HTMLWebpackPlugin({
//             template: "./index.html",
//             minify: {
//                 collapseWhitespace: isProd
//             }
//         }),
//         new CleanWebpackPlugin(),
//         new CopyWebpackPlugin([
//             {
//                 from: path.resolve(__dirname, 'src/favicon.png'),
//                 to: path.resolve(__dirname, 'dist')
//             }
//         ]),
//         new MiniCssExtractPlugin({
//             filename: filename('css'),
//         })
//     ]
//
//     if(isProd) {
//         base.push(new BundleAnalyzerPlugin())
//     }
//
//     return base
// }
//
// module.exports = {
//     context: path.resolve(__dirname, 'src'),
//     mode: 'development',
//     entry: {
//         main: ['@babel/polyfill', './index.js'],
//         analytics: './analytics.js'
//     },
//     output: {
//         filename: filename('js'),
//         path: path.resolve(__dirname, 'dist')
//     },
//     resolve: {
//         extensions: ['.js', '.json', '.jpg'],
//         alias: {
//             '@models': path.resolve(__dirname, 'src/models'),
//             '@': path.resolve(__dirname, 'src')
//         },
//     },
//     optimization: optimization(),
//     devServer: {
//         port: 4200,
//         hot: isDev
//     },
//     devtool: isDev ? 'source-map' : '',
//     plugins: plugins(),
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 use: jsLoaders()
//             },
//             // https://www.youtube.com/watch?v=eSaF8NXeNsA&t=6608s c 2 ч 25 мин - тс и реакт
//             {
//                 test: /\.css$/,
//                 // use: [
//                 //     'style-loader',
//                 //     'css-loader'
//                 // ],
//                 use: cssLoaders()
//             },
//             {
//                 test: /\.s[ac]ss$/,
//                 use: cssLoaders('sass-loader')
//             },
//             {
//                 test: /\.(png|jpg|svg|gif)$/,
//                 use: [
//                     'file-loader'
//                 ]
//             },
//             {
//                 test: /\.(ttf|woff|woff2|eot)$/,
//                 use: [
//                     'file-loader'
//                 ]
//             },
//             {
//                 test: /\.xml$/,
//                 use: [
//                     'xml-loader'
//                 ]
//             },
//             {
//                 test: /\.csv$/,
//                 use: [
//                     'csv-loader'
//                 ]
//             }
//         ]
//     }
// }