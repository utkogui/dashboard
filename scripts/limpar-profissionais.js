import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_LvhHJDS3B1Rs@ep-nameless-firefly-a8nzhm1o.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
})

async function limparProfissionais() {
  try {
    console.log('🧹 Iniciando limpeza da tabela de profissionais...')
    
    // Contar profissionais antes da limpeza
    const totalAntes = await prisma.profissional.count()
    console.log(`📊 Total de profissionais antes da limpeza: ${totalAntes}`)
    
    // Limpar todos os profissionais
    const resultado = await prisma.profissional.deleteMany({})
    
    console.log(`🗑️  Profissionais removidos: ${resultado.count}`)
    
    // Verificar se a tabela está vazia
    const totalDepois = await prisma.profissional.count()
    console.log(`📊 Total de profissionais após a limpeza: ${totalDepois}`)
    
    if (totalDepois === 0) {
      console.log('✅ Tabela de profissionais limpa com sucesso!')
    } else {
      console.log('⚠️  Ainda existem profissionais na tabela')
    }
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar limpeza
limparProfissionais()
