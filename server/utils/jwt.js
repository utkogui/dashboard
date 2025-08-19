import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_2025';
const JWT_EXPIRES_IN = '24h';
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Token inválido ou expirado');
    }
};
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch (error) {
        return null;
    }
};
