module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules\/antd/, // <--- IGNORAR ANTD
        use: ["source-map-loader"],
      },
    ],
  },
  ignoreWarnings: [
    {
      module: /node_modules[\\/]antd/,
      message: /Failed to parse source map/,
    },
  ],
};
