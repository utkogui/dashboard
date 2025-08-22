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

async function atualizarContatos() {
  try {
    console.log('🔄 Atualizando dados de contato dos profissionais...')
    
    // Ler arquivo CSV
    const csvPath = path.join(__dirname, '..', 'profi.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    
    // Dividir em linhas e remover linhas vazias
    const linhas = csvContent.split('\n').filter(linha => {
      const campos = linha.split(';')
      return campos[1] && campos[1].trim() !== ''
    })
    
    let atualizados = 0
    
    // Processar cada linha (pular header)
    for (let i = 1; i < linhas.length; i++) {
      const campos = linhas[i].split(';')
      
      const nome = campos[1].trim()
      const email = campos[2].trim()
      
      if (!nome || !email) continue
      
      // Buscar profissional no banco
      const profissional = await prisma.profissional.findUnique({
        where: { email }
      })
      
      if (!profissional) {
        console.log(`⚠️ Profissional não encontrado: ${nome}`)
        continue
      }
      
      // Extrair dados de contato do CSV (ajustando índices baseado no header)
      const dadosContato = {
        contatoClienteEmail: (campos[14] && campos[14].trim() !== '') ? campos[14].trim() : null,
        contatoClienteTeams: (campos[15] && campos[15].trim() !== '') ? campos[15].trim() : null,
        contatoClienteTelefone: (campos[16] && campos[16].trim() !== '') ? campos[16].trim() : null,
        contatoMatilhaEmail: (campos[17] && campos[17].trim() !== '') ? campos[17].trim() : null,
        contatoMatilhaTeams: (campos[18] && campos[18].trim() !== '') ? campos[18].trim() : null,
        contatoMatilhaTelefone: (campos[19] && campos[19].trim() !== '') ? campos[19].trim() : null
      }
      
      // Debug: mostrar o que está sendo extraído
      console.log(`Debug ${nome}:`, {
        pos14: campos[14], pos15: campos[15], pos16: campos[16],
        pos17: campos[17], pos18: campos[18], pos19: campos[19]
      })
      
      // Atualizar profissional
      await prisma.profissional.update({
        where: { id: profissional.id },
        data: dadosContato
      })
      
      console.log(`✅ Atualizado: ${nome}`)
      console.log(`   Matilha Email: ${dadosContato.contatoMatilhaEmail || 'não informado'}`)
      console.log(`   Cliente Email: ${dadosContato.contatoClienteEmail || 'não informado'}`)
      
      atualizados++
    }
    
    console.log(`\n🎉 Atualização concluída!`)
    console.log(`✅ ${atualizados} profissionais atualizados`)
    
  } catch (error) {
    console.error('❌ Erro durante a atualização:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar atualização
atualizarContatos().catch(console.error)
