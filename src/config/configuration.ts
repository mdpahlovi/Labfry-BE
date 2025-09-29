export default () => ({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    apiPrefix: process.env.API_PREFIX,
    appVersion: process.env.APP_VERSION,
    origin: process.env.ORIGIN,

    databaseUrl: process.env.DATABASE_URL,

    jwtSecret: process.env.JWT_SECRET,

    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
});
