const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src/entrypoint");

module.exports = {
    entry: {
        api_content: path.join(srcDir, 'api-content.tsx'),
        main_content: path.join(srcDir, 'main-content.tsx'),
        worker: path.join(srcDir, 'worker.ts'),
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
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: "../", context: "public"}],
            options: {},
        }),
    ],
};
