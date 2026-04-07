 
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_WARNING = process.env.EMAIL_WARNING;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_REMETENTE = process.env.EMAIL_REMETENTE;

const ROOT_USER = process.env.ROOT_USER;
const ROOT_PASSWORD = process.env.ROOT_PASSWORD;

export default env = {
    DATABASE_URL,
    JWT_SECRET,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_WARNING,
    EMAIL_PASS,
    EMAIL_REMETENTE,
    ROOT_USER,
    ROOT_PASSWORD
}