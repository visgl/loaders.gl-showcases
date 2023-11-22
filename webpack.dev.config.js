const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const LOADERS_LOCAL_DEPENDENCY = "loaders";
const DECK_LOCAL_DEPENDENCY = "deck";
const LUMA_LOCAL_DEPENDENCY = "luma";

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
  "@loaders.gl/tiles": path.resolve(
    __dirname,
    "../loaders.gl/modules/tiles/src"
  ),
  "@loaders.gl/textures": path.resolve(
    __dirname,
    "../loaders.gl/modules/textures/src"
  ),
  "@loaders.gl/compression": path.resolve(
    __dirname,
    "../loaders.gl/modules/compression/src"
  ),
  "@loaders.gl/worker-threads": path.resolve(
    __dirname,
    "../loaders.gl/modules/worker-threads/src"
  ),
};

const LUMA_LINK_ALIASES = {
  "@luma.gl/core": path.resolve(__dirname, "../luma.gl/modules/core/src"),
  "@luma.gl/webgl": path.resolve(__dirname, "../luma.gl/modules/webgl/src"),
  "@luma.gl/experimental": path.resolve(
    __dirname,
    "../luma.gl/modules/experimental/src"
  ),
};

function getAliasesForLocalDependencies(env) {
  let aliases = {
    // We need to have 1 `React` instance when running `yarn start-local-deck`
    react: path.resolve(__dirname, "node_modules/react"),
  };

  const possibleLocalDependencies = [
    LOADERS_LOCAL_DEPENDENCY,
    DECK_LOCAL_DEPENDENCY,
    LUMA_LOCAL_DEPENDENCY,
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
        case LUMA_LOCAL_DEPENDENCY:
          aliases = { ...aliases, ...LUMA_LINK_ALIASES };
          break;
        default:
      }
    }
  }
  return aliases;
}

module.exports = (env) => {
  const transpileOnly = env["deck"] || env["loaders"] || env["luma"];

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
      server: 'https',
      port: 8443,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      historyApiFallback: true,
      // For testing workers from local loaders.gl repo
      static: {
        directory: path.join(__dirname, '../loaders.gl'),
      },
    },
    module: {
      parser: {
        javascript: {
          exportsPresence: "warn",
        },
      },
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
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly,
              },
            },
          ],
        },
        {
          test: /\.m?js/,
          resolve: {
            // Need to run deck.gl locally
            fullySpecified: false,
          },
        },
        {
          test: /\.(png|jpe?g|gif|jp2|webp)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.css$/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }],
        },
        {
          test: /\.mp4$/,
          use: "file-loader?name=videos/[name].[ext]",
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
