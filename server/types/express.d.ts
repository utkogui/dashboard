// Augmentação de tipos do Express para incluir req.usuario
import type { JWTPayload } from '../utils/jwt'

declare global {
  namespace Express {
    interface Request {
      usuario?: JWTPayload
    }
  }
}

export {}
