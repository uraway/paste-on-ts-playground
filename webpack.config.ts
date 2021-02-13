import webpack from "webpack";
import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

const config: webpack.Configuration = {
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.join(__dirname, "src/popup/index.tsx"),
    options: path.join(__dirname, "src/options/index.tsx"),
    background: path.join(__dirname, "src/background/index.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "",
  },
  module: {
    rules: [
      {
        exclude: "/node_modules/",
        use: "ts-loader",
        test: /.tsx?$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
      { test: /\.svg$/, loader: "file-loader" },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ["typescript", "json"],
    }),
  ],
};

export default config;
