/**
 * Script para exportar dados do SQLite para migração para o Neon PostgreSQL
 * 
 * Este script exporta os dados do banco SQLite e os prepara para importação
 * no PostgreSQL. Ele usa acesso direto ao SQLite (better-sqlite3), evitando
 * dependência do provider configurado no Prisma.
 * 
 * Instruções:
 * 1. Execute este script para exportar os dados do SQLite
 * 2. Os dados serão salvos no diretório ./migration-data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Database from 'better-sqlite3';

// Configuração
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '../migration-data');
const SQLITE_DB_PATH = path.join(__dirname, '../prisma/dev.db');

// Criar diretório de saída se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Abrir banco SQLite diretamente
const db = new Database(SQLITE_DB_PATH, { readonly: true });

function exportTableRaw(sqlTableName, outputName) {
  try {
    console.log(`Exportando tabela: ${outputName} (origem: ${sqlTableName})...`);
    const rows = db.prepare(`SELECT * FROM ${sqlTableName}`).all();
    const outputFile = path.join(OUTPUT_DIR, `${outputName}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2));
    console.log(`  ✅ Exportados ${rows.length} registros para ${outputFile}`);
  } catch (error) {
    console.error(`  ❌ Erro ao exportar ${sqlTableName}:`, error.message);
  }
}

function exportAllData() {
  console.log('Iniciando exportação de dados do SQLite...');

  // Mapear nomes físicos (SQLite) -> nomes de arquivo esperados pelo import
  exportTableRaw('clientes_sistema', 'clientesSistema');
  exportTableRaw('usuarios', 'usuarios');
  exportTableRaw('profissionais', 'profissionais');
  exportTableRaw('clientes', 'clientes');
  exportTableRaw('contratos', 'contratos');
  exportTableRaw('contrato_profissionais', 'contratoProfissionais');
  exportTableRaw('despesas_adicionais', 'despesasAdicionais');
  exportTableRaw('cliente_interesses', 'clienteInteresses');
  exportTableRaw('cliente_notas', 'clienteNotas');
  exportTableRaw('solicitacoes_profissional', 'solicitacoesProfissional');

  console.log('\nExportação concluída com sucesso! 🎉');
  console.log(`\nOs dados foram exportados para o diretório: ${OUTPUT_DIR}`);
  console.log('\nPróximos passos:');
  console.log('1. Certifique-se de que o arquivo .env está com a URL do Neon');
  console.log('2. Se ainda não fez, execute a migração: npm run neon:migrate');
  console.log('3. Importe os dados: npm run neon:import');
}

try {
  exportAllData();
} finally {
  try { db.close(); } catch {}
}
