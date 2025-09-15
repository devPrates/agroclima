#!/usr/bin/env node

/**
 * Script para gerar um token JWT único
 * Execute com: node scripts/token-generator.js
 */

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Verificar se a chave JWT está configurada
if (!process.env.JWT_SECRET) {
  console.error('❌ Erro: JWT_SECRET não está definido no arquivo .env');
  console.log('💡 Adicione JWT_SECRET=sua_chave_secreta no arquivo .env');
  process.exit(1);
}

console.log('🔐 Gerador de Token JWT - AgroClima');
console.log('===================================\n');

try {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    sub: 1,
    name: 'Tester',
    iat: now,
    exp: now + (60 * 60) // 1 hora
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    header: {
      typ: 'JWT',
      alg: 'HS256'
    }
  });
  
  const timestamp = new Date().toLocaleString('pt-BR');
  console.log(`🔑 [${timestamp}] Token gerado com sucesso:`);
  console.log(`\nToken: ${token}\n`);
  console.log('✅ Token copiado para o console!');
} catch (error) {
  console.error('❌ Erro ao gerar token:', error);
  process.exit(1);
}