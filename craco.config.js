const million = require('million/compiler');
module.exports = {
  webpack: {
    plugins: { add: [million.webpack()] }
  },
  devServer: {
    allowedHosts: 'all', // or ['localhost', '.your-domain.com']
  },
};