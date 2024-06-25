const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias["./uuid.web"] = path.resolve(
    __dirname,
    "node_modules/expo-modules-core/build/uuid/uuid.web.custom.js"
  );

  return config;
};
