module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/api', // The backend API URL
        pathRewrite: {
          '^/api': '', // Remove the '/api' prefix from the request path
        },
      },
    },
  },
  transpileDependencies: true, // Optionally, include any other configurations here
};
