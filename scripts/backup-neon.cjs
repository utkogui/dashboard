#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada no .env')
  process.exit(1)
}

// Criar diretório de backups se não existir
const backupDir = path.join(__dirname, '..', 'backups')
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

// Nome do arquivo com timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const backupFile = path.join(backupDir, `neon-backup-${timestamp}.sql`)

console.log('🔄 Iniciando backup do banco Neon...')
console.log(`📁 Arquivo: ${backupFile}`)

try {
  // Fazer backup usando pg_dump
  execSync(`pg_dump "${DATABASE_URL}" > "${backupFile}"`, {
    stdio: 'inherit'
  })
  
  console.log('✅ Backup concluído com sucesso!')
  console.log(`📊 Tamanho: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`)
  
} catch (error) {
  console.error('❌ Erro ao fazer backup:', error.message)
  process.exit(1)
}
