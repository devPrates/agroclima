import jwt from 'jsonwebtoken';

interface JWTPayload {
  sub: number;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Gera um token JWT com os dados fornecidos
 * @param payload - Dados a serem incluídos no token
 * @param expiresIn - Tempo de expiração (padrão: 1h)
 * @returns Token JWT assinado
 */
export function generateToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: string = '1h'
): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
  }

  const now = Math.floor(Date.now() / 1000);
  
  const tokenPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + getExpirationTime(expiresIn)
  };

  return jwt.sign(tokenPayload, secret, {
    algorithm: 'HS256',
    header: {
      typ: 'JWT',
      alg: 'HS256'
    }
  });
}

/**
 * Verifica e decodifica um token JWT
 * @param token - Token a ser verificado
 * @returns Payload decodificado
 */
export function verifyToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
  }

  try {
    const decoded = jwt.verify(token, secret) as unknown;
    if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded && 'name' in decoded) {
      return decoded as JWTPayload;
    }
    throw new Error('Invalid token payload structure');
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}

/**
 * Converte string de tempo em segundos
 * @param timeString - String de tempo (ex: '1h', '30m', '7d')
 * @returns Tempo em segundos
 */
function getExpirationTime(timeString: string): number {
  const timeUnit = timeString.slice(-1);
  const timeValue = parseInt(timeString.slice(0, -1));
  
  switch (timeUnit) {
    case 's': return timeValue;
    case 'm': return timeValue * 60;
    case 'h': return timeValue * 60 * 60;
    case 'd': return timeValue * 24 * 60 * 60;
    default: return 3600; // 1 hora por padrão
  }
}

// Exemplo de uso para gerar o token específico mencionado
export function generateExampleToken(): string {
  return generateToken({
    sub: 1,
    name: 'Tester'
  }, '1h');
}