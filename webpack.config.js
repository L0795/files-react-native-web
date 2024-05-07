const dotEnv = require('dotenv-webpack');
const path = require('path'); 
const webpack = require('webpack'); 

const HtmlWebpackPlugin = require('html-webpack-plugin'); 

const appDirectory = path.resolve(__dirname); 

const {presets, plugins} = require(`${appDirectory}/babel.config.web.js`); 

const compileNodeModules = [ 
  // Add every react-native package that needs compiling 
  // 'react-native-gesture-handler', 
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`)); 


const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  loader: 'babel-loader',
  options: {
    presets,
    plugins,
  },
};

const svgLoaderConfiguration = { 
  test: /\.svg$/, 
  use: [ 
    { 
      loader: '@svgr/webpack', 
    }, 
  ], 
}; 

const imageLoaderConfiguration = { 
    test: /\.(png|jpe?g|gif)$/i, 
    use: { 
      loader: 'url-loader', 
      options: { 
        name: '[name].[ext]', 
      }, 
    }, 
  }; 
  
  module.exports = (env, argv) => { 
    return {
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },
      entry: { 
        app: path.join(__dirname, 'index.web.js'), 
      }, 
      output: { 
        path: path.resolve(appDirectory, 'dist'), 
        //publicPath: '/', 
        filename: 'main.[contenthash].js',
        clean: true, 
      }, 
      resolve: { 
        extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'], 
        alias: {
          'react-native$': 'react-native-web',
          'react-native-linear-gradient$': 'react-native-web-linear-gradient',
          aplicacion: path.resolve(__dirname, 'src/aplicacion/'),
          dominio: path.resolve(__dirname, 'src/dominio/'),
          presentacion: path.resolve(__dirname, 'src/presentacion/'),
        }, 
      }, 
      module: { 
        rules: [
          babelLoaderConfiguration,
          imageLoaderConfiguration,
          svgLoaderConfiguration, 
         
        ], 
      }, 
      plugins: [ 
        new dotEnv({
          path: path.resolve(appDirectory, `.env.${argv.mode}`), // `.env.${env}`),
        }),
        new HtmlWebpackPlugin({ 
          template: path.join(__dirname, 'public/index.html'), 
        }), 
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|es/),
        //new webpack.HotModuleReplacementPlugin(), 
        new webpack.DefinePlugin({ 
          // See: https://github.com/necolas/react-native-web/issues/349 
          __DEV__: JSON.stringify(true),
          'process.env.JEST_WORKER_ID': JSON.stringify(
            process.env.JEST_WORKER_ID,
          ), 
        }), 
        //new BundleAnalyzerPlugin() // Analyze your bundle
      ],
    }
    
  }; 
