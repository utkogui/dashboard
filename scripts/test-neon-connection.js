/**
 * Script para testar a conexão com o banco de dados Neon PostgreSQL
 * 
 * Este script testa a conexão com o banco de dados Neon PostgreSQL configurado no arquivo .env
 * e verifica se as tabelas foram criadas corretamente.
 * 
 * Instruções:
 * 1. Certifique-se de que o arquivo .env está configurado com a URL de conexão do Neon PostgreSQL
 * 2. Execute este script para testar a conexão
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Verificar se a URL do banco de dados está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ A variável de ambiente DATABASE_URL não está configurada!');
  console.error('Por favor, configure o arquivo .env com a URL de conexão do Neon PostgreSQL.');
  process.exit(1);
}

// Inicializar cliente Prisma
const prisma = new PrismaClient();

/**
 * Função para testar a conexão com o banco de dados
 */
async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados Neon PostgreSQL...');
    
    // Testar conexão básica
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Verificar tabelas
    console.log('\n📋 Verificando tabelas do banco de dados...');
    
    const tables = [
      { name: 'ClienteSistema', query: () => prisma.clienteSistema.count() },
      { name: 'Usuario', query: () => prisma.usuario.count() },
      { name: 'Profissional', query: () => prisma.profissional.count() },
      { name: 'Cliente', query: () => prisma.cliente.count() },
      { name: 'Contrato', query: () => prisma.contrato.count() },
      { name: 'ContratoProfissional', query: () => prisma.contratoProfissional.count() },
      { name: 'DespesaAdicional', query: () => prisma.despesaAdicional.count() },
      { name: 'ClienteInteresse', query: () => prisma.clienteInteresse.count() },
      { name: 'ClienteNota', query: () => prisma.clienteNota.count() },
      { name: 'SolicitacaoProfissional', query: () => prisma.solicitacaoProfissional.count() }
    ];
    
    for (const table of tables) {
      try {
        const count = await table.query();
        console.log(`  ✅ Tabela ${table.name}: ${count} registros`);
      } catch (error) {
        console.error(`  ❌ Erro ao acessar tabela ${table.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro ao testar conexão:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar teste de conexão
testConnection().catch(console.error);
