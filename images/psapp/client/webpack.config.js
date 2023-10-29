let fs = require('fs');
let path = require('path');
let webpack = require('webpack');
let TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

class AutoGenPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('AutoGenPlugin', (compilation) => {
      let autogenPath = path.join(compiler.context, 'src/autogen');
      if (!fs.existsSync(autogenPath)) {
        fs.mkdirSync(autogenPath);
      }
      const dir = path.join(compiler.context, 'src/modules');
      const files = fs.readdirSync(dir);
      const moduleNames = files.map(
        f => path.basename(f)
      ).filter(
        f => f !== 'common'
      );
      const json = JSON.stringify(moduleNames);
      fs.writeFileSync(path.join(autogenPath, 'available-modules.json'), json);
      console.log(
        'writing ' + moduleNames.length +
            ' modules to autogen/available-modules.json'
      );
    });
  }
}
module.exports = {
  mode: 'development',
  watchOptions: {
    // HACK: we auto-generate some files e.g. the modules.json above.
    // Those are stored in the src/autogen directory,
    // and then we import from that directory in our source code.
    // We must not watch these files because they will trigger a re-build,
    // which will touch these files again, which will trigger a re-build, etc..
    ignored: ['/presupplied/images/psapp/client/src/autogen'],
  },
  entry: {
    client: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }, {
        test: /\.css$/i,
        use: [
          // Translates CSS into CommonJS
          'css-loader',
        ],
      }, {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }, {
        test: /\.wav$/,
        type: 'asset/resource',
        generator: {
          filename: 'wav/[name]-[hash][ext][query]',
        },
      }, {
        test: /\.svg$/i,
        use: [{
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [{
                  name: 'preset-default',
                  params: {
                    overrides: {
                      cleanupIDs: {
                        remove: false,
                      },
                    },
                  },
                },
              ],
            }
          }
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [new AutoGenPlugin()],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../static/dist'),
  },
  devtool: 'source-map',
  node: {
    __filename: true,
    __dirname: true,
  },
};
