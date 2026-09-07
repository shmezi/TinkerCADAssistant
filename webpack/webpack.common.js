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
        clean: true, // Clean the output directory before build
    },
    optimization: {
        splitChunks: {
            // Exclude content scripts from chunk splitting
            chunks(chunk) {
                return chunk.name !== 'api_content' && chunk.name !== 'main_content';
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