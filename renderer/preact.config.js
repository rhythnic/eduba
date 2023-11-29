module.exports = (config, env, helpers) => {
  // Serve scripts from same directory as index.html
  config.output.publicPath = "./";

  // const { plugin: htmlWebpackPlugin } = helpers.getPluginsByName(
  //   config,
  //   "HtmlWebpackPlugin"
  // )[0];

  // htmlWebpackPlugin.options.inlineCss = false;
  // htmlWebpackPlugin.options.config["inline-css"] = false;

  // Add Tailwind CSS
  const postCssLoaders = helpers.getLoadersByName(config, "postcss-loader");
  postCssLoaders.forEach(({ loader }) => {
    const { plugins } = loader.options.postcssOptions;

    const tailwindPlugin = require("tailwindcss");

    // Add tailwind css at the top.
    plugins.unshift(tailwindPlugin);
  });

  return config;
};
