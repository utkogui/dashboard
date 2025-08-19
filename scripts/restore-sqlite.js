/**
 * Script para restaurar o schema.prisma para SQLite
 * 
 * Este script restaura o schema.prisma para usar SQLite em vez de PostgreSQL.
 * Útil para voltar ao banco de dados local após testes com Neon PostgreSQL.
 * 
 * Instruções:
 * 1. Execute este script para restaurar o schema.prisma para SQLite
 * 2. Execute npx prisma generate para atualizar o cliente Prisma
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const sqliteSchemaPath = path.join(__dirname, '../prisma/schema.sqlite.prisma');
const backupSchemaPath = path.join(__dirname, '../prisma/schema.postgres.prisma');

// Verificar se o arquivo schema.sqlite.prisma existe
if (!fs.existsSync(sqliteSchemaPath)) {
  console.error('❌ O arquivo schema.sqlite.prisma não foi encontrado!');
  console.error('Por favor, verifique se o arquivo existe em prisma/schema.sqlite.prisma.');
  process.exit(1);
}

try {
  // Fazer backup do schema.prisma atual (PostgreSQL)
  if (fs.existsSync(schemaPath)) {
    console.log('📦 Fazendo backup do schema.prisma atual para schema.postgres.prisma...');
    fs.copyFileSync(schemaPath, backupSchemaPath);
  }

  // Copiar schema.sqlite.prisma para schema.prisma
  console.log('🔄 Restaurando schema.prisma para SQLite...');
  fs.copyFileSync(sqliteSchemaPath, schemaPath);

  console.log('✅ Schema.prisma restaurado para SQLite com sucesso!');
  console.log('\nPróximos passos:');
  console.log('1. Execute: npx prisma generate');
  console.log('2. Reinicie o servidor: npm run dev:full');
} catch (error) {
  console.error('❌ Erro ao restaurar schema.prisma:', error);
  process.exit(1);
}
