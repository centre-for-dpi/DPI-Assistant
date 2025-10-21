import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const COGNITO_REGION = process.env.AWS_REGION || 'ap-south-1';
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

if (!COGNITO_USER_POOL_ID) {
  throw new Error('COGNITO_USER_POOL_ID environment variable is required');
}

const COGNITO_ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;

// Create JWKS client to fetch public keys from Cognito
const client = jwksClient({
  jwksUri: `${COGNITO_ISSUER}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
});

// Get signing key from JWKS
function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

// Extend Express Request to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        email_verified: boolean;
        [key: string]: any;
      };
    }
  }
}

// Middleware to verify JWT token
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    jwt.verify(
      token,
      getKey,
      {
        issuer: COGNITO_ISSUER,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          console.error('Token verification failed:', err.message);
          res.status(401).json({ error: 'Invalid token' });
          return;
        }

        // Attach user info to request
        req.user = decoded as any;
        next();
      }
    );
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
}

// Optional: Middleware for endpoints that work with or without auth
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, but that's okay for optional auth
      next();
      return;
    }

    const token = authHeader.substring(7);

    jwt.verify(
      token,
      getKey,
      {
        issuer: COGNITO_ISSUER,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (!err) {
          req.user = decoded as any;
        }
        // Continue regardless of verification result
        next();
      }
    );
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
}
