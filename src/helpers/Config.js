const config = {
  sendgrid: {
    key: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM,
  },
};

module.exports = config;
