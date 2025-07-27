module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      // Only apply optimizations in production
      if (env === 'production') {
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            maxSize: 500000,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                enforce: true,
                reuseExistingChunk: true
              },
              mui: {
                test: /[\\/]node_modules[\\/]@mui[\\/]/,
                name: 'mui',
                chunks: 'all',
                enforce: true,
                reuseExistingChunk: true
              }
            }
          }
        };
      } else {
        // Development: Minimal chunk splitting for faster builds
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 0,
            maxSize: 1000000, // 1MB max for dev
            cacheGroups: {
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true
              }
            }
          }
        };
      }

      // Set chunk timeout for both environments
      webpackConfig.output.chunkLoadTimeout = 30000;

      return webpackConfig;
    }
  },
  devServer: {
    // Remove deprecated options and optimize for speed
    hot: true,
    liveReload: true,
    compress: true,
    static: {
      publicPath: '/'
    }
  }
};
