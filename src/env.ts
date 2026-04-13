
const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,

    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_WARNING: process.env.EMAIL_WARNING,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_REMETENTE: process.env.EMAIL_REMETENTE,

    ROOT_USER: process.env.ROOT_USER,
    ROOT_PASSWORD: process.env.ROOT_PASSWORD,
    ROOT_EMAIL: process.env.ROOT_EMAIL,
}

export default env;