/**
 * Script para migrar dados do SQLite para PostgreSQL (Supabase ou Neon)
 * 
 * Este script exporta os dados do banco SQLite e os prepara para importação
 * no PostgreSQL. Ele usa o Prisma para ler os dados do SQLite e criar
 * instruções SQL para inserção no PostgreSQL.
 * 
 * Instruções:
 * 1. Configure o arquivo .env com a URL de conexão do PostgreSQL
 * 2. Execute este script para exportar os dados
 * 3. Execute as migrações do Prisma para criar as tabelas no PostgreSQL
 * 4. Importe os dados para o PostgreSQL
 */

import { PrismaClient as PrismaClientSQLite } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Configuração
const OUTPUT_DIR = './migration-data';
const SQLITE_DATABASE_URL = 'file:./prisma/dev.db';

// Criar diretório de saída se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Inicializar cliente Prisma para SQLite
const prismaSQLite = new PrismaClientSQLite({
  datasources: {
    db: {
      url: SQLITE_DATABASE_URL,
    },
  },
});

/**
 * Função para exportar dados de uma tabela
 */
async function exportTable(tableName, query) {
  try {
    console.log(`Exportando tabela: ${tableName}...`);
    const data = await query();
    
    if (data.length === 0) {
      console.log(`  Tabela ${tableName} está vazia, pulando.`);
      return;
    }
    
    // Salvar dados em formato JSON para posterior importação
    const outputFile = path.join(OUTPUT_DIR, `${tableName}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    
    console.log(`  ✅ Exportados ${data.length} registros para ${outputFile}`);
  } catch (error) {
    console.error(`  ❌ Erro ao exportar tabela ${tableName}:`, error);
  }
}

/**
 * Função principal para exportar todos os dados
 */
async function exportAllData() {
  try {
    console.log('Iniciando exportação de dados do SQLite...');
    
    // Exportar tabelas na ordem correta (respeitando dependências)
    await exportTable('clientesSistema', () => prismaSQLite.clienteSistema.findMany());
    await exportTable('usuarios', () => prismaSQLite.usuario.findMany());
    await exportTable('profissionais', () => prismaSQLite.profissional.findMany());
    await exportTable('clientes', () => prismaSQLite.cliente.findMany());
    await exportTable('contratos', () => prismaSQLite.contrato.findMany());
    await exportTable('contratoProfissionais', () => prismaSQLite.contratoProfissional.findMany());
    await exportTable('despesasAdicionais', () => prismaSQLite.despesaAdicional.findMany());
    await exportTable('clienteInteresses', () => prismaSQLite.clienteInteresse.findMany());
    await exportTable('clienteNotas', () => prismaSQLite.clienteNota.findMany());
    await exportTable('solicitacoesProfissional', () => prismaSQLite.solicitacaoProfissional.findMany());
    
    console.log('\nExportação concluída com sucesso! 🎉');
    console.log(`\nOs dados foram exportados para o diretório: ${OUTPUT_DIR}`);
    console.log('\nPróximos passos:');
    console.log('1. Configure o arquivo .env com a URL de conexão do PostgreSQL');
    console.log('2. Execute as migrações do Prisma: npx prisma migrate deploy');
    console.log('3. Execute o script de importação: node scripts/import-to-postgres.js');
    
  } catch (error) {
    console.error('Erro durante a exportação:', error);
  } finally {
    await prismaSQLite.$disconnect();
  }
}

// Executar exportação
exportAllData().catch(console.error);
