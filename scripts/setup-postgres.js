/**
 * Script para configurar o banco de dados PostgreSQL (Supabase ou Neon)
 * 
 * Este script executa os passos necessários para configurar o banco de dados PostgreSQL,
 * incluindo a geração do cliente Prisma e a criação das migrações.
 * 
 * Instruções:
 * 1. Certifique-se de que o arquivo .env está configurado com a URL de conexão do PostgreSQL
 * 2. Execute este script para configurar o banco de dados
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Verificar se a URL do banco de dados está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ A variável de ambiente DATABASE_URL não está configurada!');
  console.error('Por favor, configure o arquivo .env com a URL de conexão do PostgreSQL.');
  process.exit(1);
}

/**
 * Função para executar comandos do Prisma
 */
function runPrismaCommand(command) {
  try {
    console.log(`Executando: npx prisma ${command}`);
    execSync(`npx prisma ${command}`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar 'npx prisma ${command}':`, error.message);
    return false;
  }
}

/**
 * Função principal para configurar o banco de dados
 */
async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuração do banco de dados PostgreSQL...');
    
    // Gerar cliente Prisma
    console.log('\n📦 Gerando cliente Prisma...');
    if (!runPrismaCommand('generate')) {
      throw new Error('Falha ao gerar o cliente Prisma.');
    }
    
    // Criar migrações
    console.log('\n🔄 Criando migrações do banco de dados...');
    if (!runPrismaCommand('migrate dev --name initial')) {
      throw new Error('Falha ao criar as migrações do banco de dados.');
    }
    
    console.log('\n✅ Configuração do banco de dados concluída com sucesso!');
    console.log('\nPróximos passos:');
    console.log('1. Execute o script de exportação: node scripts/migrate-to-postgres.js');
    console.log('2. Execute o script de importação: node scripts/import-to-postgres.js');
    
  } catch (error) {
    console.error('\n❌ Erro durante a configuração do banco de dados:', error.message);
    process.exit(1);
  }
}

// Executar configuração
setupDatabase().catch(console.error);
