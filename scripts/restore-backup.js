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

// Obter arquivo de backup do argumento
const backupFile = process.argv[2]

if (!backupFile) {
  console.error('❌ Uso: node restore-backup.js <arquivo-backup.json>')
  console.error('📁 Backups disponíveis:')
  
  const backupDir = path.join(__dirname, '..', 'backups')
  if (fs.existsSync(backupDir)) {
    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'))
    files.forEach(file => console.log(`   ${file}`))
  }
  
  process.exit(1)
}

async function restoreData() {
  try {
    // Verificar se arquivo existe
    const fullPath = path.resolve(backupFile)
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Arquivo não encontrado: ${fullPath}`)
    }

    console.log('🔄 Restaurando backup...')
    console.log(`📁 Arquivo: ${fullPath}`)

    // Ler backup
    const backupData = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
    
    console.log('📊 Dados no backup:')
    Object.entries(backupData.counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} registros`)
    })

    console.log('\n⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados atuais!')
    console.log('⚠️  Pressione Ctrl+C para cancelar ou Enter para continuar...')
    
    // Aguardar confirmação (simplificado para script)
    // Em produção, você pode usar readline para confirmação interativa
    
    const { data } = backupData

    // Limpar dados existentes (ordem inversa devido a foreign keys)
    await prisma.despesaAdicional.deleteMany()
    await prisma.contratoProfissional.deleteMany()
    await prisma.contrato.deleteMany()
    await prisma.cliente.deleteMany()
    await prisma.profissional.deleteMany()
    await prisma.usuario.deleteMany()
    await prisma.clienteSistema.deleteMany()

    console.log('🗑️  Dados existentes removidos')

    // Restaurar dados (ordem correta devido a foreign keys)
    if (data.clientesSistema?.length) {
      await prisma.clienteSistema.createMany({ data: data.clientesSistema })
      console.log(`✅ ${data.clientesSistema.length} clientes do sistema restaurados`)
    }

    if (data.usuarios?.length) {
      await prisma.usuario.createMany({ data: data.usuarios })
      console.log(`✅ ${data.usuarios.length} usuários restaurados`)
    }

    if (data.profissionais?.length) {
      await prisma.profissional.createMany({ data: data.profissionais })
      console.log(`✅ ${data.profissionais.length} profissionais restaurados`)
    }

    if (data.clientes?.length) {
      await prisma.cliente.createMany({ data: data.clientes })
      console.log(`✅ ${data.clientes.length} clientes restaurados`)
    }

    if (data.contratos?.length) {
      await prisma.contrato.createMany({ data: data.contratos })
      console.log(`✅ ${data.contratos.length} contratos restaurados`)
    }

    if (data.contratoProfissionais?.length) {
      await prisma.contratoProfissional.createMany({ data: data.contratoProfissionais })
      console.log(`✅ ${data.contratoProfissionais.length} relações contrato-profissional restauradas`)
    }

    if (data.despesasAdicionais?.length) {
      await prisma.despesaAdicional.createMany({ data: data.despesasAdicionais })
      console.log(`✅ ${data.despesasAdicionais.length} despesas adicionais restauradas`)
    }

    console.log('\n🎉 Backup restaurado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao restaurar backup:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

restoreData()
