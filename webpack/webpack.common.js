const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
      popup: path.join(srcDir, 'popup.tsx'),
      options: path.join(srcDir, 'options.tsx'),
      background: path.join(srcDir, 'background.ts'),
      content_script: path.join(srcDir, 'content_script.tsx'),
      youtubeHelper: path.join(srcDir, 'youtubeHelper.tsx'),
      tabRecorder: path.join(srcDir, "tabRecorder.ts")
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
              return chunk.name !== 'background';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {  
                        transpileOnly: true, // 只转译，不做类型检查  
                        happyPackMode: true  
                    }
                }],
                exclude: [
                    /node_modules/,
                    /__tests__/,
                    /src\/__tests__/,
                    /\.test\.tsx?$/
                ],
                
            },
            {  
                test: /\.css$/,  
                use: ['style-loader', 'css-loader', 'postcss-loader']  
            } ,
            {
                test: /\.ts?$/,
                use: [{
                    loader: "ts-loader",
                    options: {  
                        transpileOnly: true, // 只转译，不做类型检查  
                        happyPackMode: true  
                    }
                }],
                exclude: [
                    /node_modules/,
                    /__tests__/,
                    /\.test\.ts?$/
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {  
            '@': path.resolve(__dirname, 'src')  
          }  
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};
