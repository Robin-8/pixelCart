module.exports = {
  apps: [
    {
      name: 'PixelCart',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      env: {
        RAZORPAY_API_KEY: 'rzp_test_pGz4qvobcKcY0w',
        key_secret: 'pH1BfIUA8rp2D33YqG0OOYQJ'
      },
    },
  ],
};

