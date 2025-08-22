#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar variáveis de ambiente
dotenv.config()

const prisma = new PrismaClient()

// Criar diretório de backups se não existir
const backupDir = path.join(__dirname, '..', 'backups')
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

// Nome do arquivo com timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const backupFile = path.join(backupDir, `prisma-backup-${timestamp}.json`)

async function backupData() {
  try {
    console.log('🔄 Iniciando backup via Prisma...')
    console.log(`📁 Arquivo: ${backupFile}`)

    // Buscar todos os dados
    const [
      clientesSistema,
      usuarios,
      profissionais,
      clientes,
      contratos,
      contratoProfissionais,
      despesasAdicionais
    ] = await Promise.all([
      prisma.clienteSistema.findMany(),
      prisma.usuario.findMany(),
      prisma.profissional.findMany(),
      prisma.cliente.findMany(),
      prisma.contrato.findMany(),
      prisma.contratoProfissional.findMany(),
      prisma.despesaAdicional.findMany()
    ])

    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        clientesSistema,
        usuarios,
        profissionais,
        clientes,
        contratos,
        contratoProfissionais,
        despesasAdicionais
      },
      counts: {
        clientesSistema: clientesSistema.length,
        usuarios: usuarios.length,
        profissionais: profissionais.length,
        clientes: clientes.length,
        contratos: contratos.length,
        contratoProfissionais: contratoProfissionais.length,
        despesasAdicionais: despesasAdicionais.length
      }
    }

    // Salvar backup
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2))
    
    console.log('✅ Backup concluído com sucesso!')
    console.log('📊 Dados exportados:')
    Object.entries(backup.counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} registros`)
    })
    console.log(`📁 Tamanho: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`)
    
  } catch (error) {
    console.error('❌ Erro ao fazer backup:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

backupData()
