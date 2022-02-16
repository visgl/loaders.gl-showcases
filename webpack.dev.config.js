const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const LOADERS_LOCAL_DEPENDENCY = "loaders";
const DECK_LOCAL_DEPENDENCY = "deck";

const DECK_LINK_ALIASES = {
  "@deck.gl/core": path.resolve(__dirname, "../deck.gl/modules/core/src"),
  "@deck.gl/layers": path.resolve(__dirname, "../deck.gl/modules/layers/src"),
  "@deck.gl/mesh-layers": path.resolve(
    __dirname,
    "../deck.gl/modules/mesh-layers/src"
  ),
  "@deck.gl/geo-layers": path.resolve(
    __dirname,
    "../deck.gl/modules/geo-layers/src"
  ),
  "@deck.gl/react": path.resolve(__dirname, "../deck.gl/modules/react/src"),
};

const LOADERS_LINK_ALIASES = {
  "@loaders.gl/i3s": path.resolve(__dirname, "../loaders.gl/modules/i3s/src"),
};

function getAliasesForLocalDependencies(env) {
  let aliases = {
    // We need to have 1 `React` instance when running `yarn start-local-deck`
    react: path.resolve(__dirname, "node_modules/react"),
  };

  const possibleLocalDependencies = [
    LOADERS_LOCAL_DEPENDENCY,
    DECK_LOCAL_DEPENDENCY,
  ];

  for (const dependency of possibleLocalDependencies) {
    const shouldAddLocalDependency = env[dependency];

    if (shouldAddLocalDependency) {
      switch (dependency) {
        case LOADERS_LOCAL_DEPENDENCY:
          aliases = { ...aliases, ...LOADERS_LINK_ALIASES };
          break;
        case DECK_LOCAL_DEPENDENCY:
          aliases = { ...aliases, ...DECK_LINK_ALIASES };
          break;
        default:
      }
    }
  }
  return aliases;
}

/**
 * Returns loader for 'ts' and 'tsx' files.
 * If we are using '--deck' or '--loaders' env variables we should avoid TypeScript issues from deck.gl or loaders.gl folder.
 * TODO: We should always use ts-loader once all issues with deck.gl and loaders.gl types have been resolved.
 */
function getLoaders(env) {
  // Use simple babel loader without typescript to avoid local deck.gl or loader.gl typing issues.
  if (env["deck"] || env["loaders"]) {
    return {
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-env",
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
    };
  }

  return {
    loader: "ts-loader",
  };
}

module.exports = (env) => {
  return {
    mode: "development",
    entry: [
      // Need to run loaders.gl locally
      "regenerator-runtime/runtime.js",
      path.join(__dirname, "src", "index.js"),
    ],
    output: {
      path: path.resolve(__dirname, "build"),
    },
    devtool: "inline-source-map",
    devServer: {
      open: true,
      port: 3000,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    module: {
      rules: [
        {
          test: [/\.(js)$/],
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
              },
            },
          ],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [getLoaders(env)],
        },
        {
          test: /\.m?js/,
          resolve: {
            // Need to run deck.gl locally
            fullySpecified: false,
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".mjs"],
      alias: {
        ...getAliasesForLocalDependencies(env),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
      }),
    ],
  };
};
