const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
        common: path.join(srcDir, "common.tsx"),
        api_content: path.join(srcDir, 'api_content.tsx'),
        service_worker: path.join(srcDir, 'service_worker.ts'),
        main_content: path.join(srcDir, 'main_content.tsx'),
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
