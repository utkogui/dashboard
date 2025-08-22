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

// Função para processar data no formato DD/MM/YY
function processarData(dataStr) {
  if (!dataStr || dataStr.trim() === '') return new Date().toISOString().split('T')[0]
  
  // Tentar diferentes formatos
  try {
    // Formato DD/MM/YY
    if (dataStr.includes('/')) {
      const [dia, mes, ano] = dataStr.split('/')
      let anoCompleto = ano
      
      // Se ano tem 2 dígitos, assumir 20XX
      if (ano.length === 2) {
        anoCompleto = `20${ano}`
      }
      
      return `${anoCompleto}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
    }
    
    // Formato YYYY-MM-DD
    if (dataStr.includes('-')) {
      return dataStr
    }
    
    // Se não conseguir processar, usar data atual
    return new Date().toISOString().split('T')[0]
  } catch (error) {
    console.warn(`Erro ao processar data "${dataStr}":`, error.message)
    return new Date().toISOString().split('T')[0]
  }
}

// Função para processar valor numérico
function processarValor(valorStr) {
  if (!valorStr || valorStr.trim() === '') return null
  
  // Substituir vírgula por ponto para decimais
  const valorLimpo = valorStr.replace(',', '.')
  const valor = parseFloat(valorLimpo)
  
  return isNaN(valor) ? null : valor
}

async function importarCSV() {
  try {
    console.log('🔄 Iniciando importação do arquivo profi.csv...')
    
    // Ler arquivo CSV
    const csvPath = path.join(__dirname, '..', 'profi.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    
    // Dividir em linhas e remover linhas vazias
    const linhas = csvContent.split('\n').filter(linha => {
      const campos = linha.split(';')
      // Linha é válida se tem nome preenchido
      return campos[1] && campos[1].trim() !== ''
    })
    
    // Primeira linha são os headers
    const headers = linhas[0].split(';')
    console.log('📋 Headers encontrados:', headers.slice(0, 5), '... (e mais)')
    
    // Processar dados
    const profissionais = []
    
    for (let i = 1; i < linhas.length; i++) {
      const campos = linhas[i].split(';')
      
      // Pular linhas com nome vazio
      if (!campos[1] || campos[1].trim() === '') continue
      
      const profissional = {
        nome: campos[1].trim(),
        email: campos[2].trim(),
        especialidade: campos[3].trim() || 'Não informado',
        perfil: campos[4].trim() || null,
        especialidadeEspecifica: campos[5].trim() || null,
        valorHora: processarValor(campos[6]),
        status: campos[7].trim() || 'ativo',
        dataInicio: processarData(campos[8]),
        tipoContrato: campos[9].trim() || 'fechado',
        valorFechado: processarValor(campos[10]),
        periodoFechado: campos[11].trim() || 'mensal',
        valorPago: processarValor(campos[12]) || 0,
        tags: campos[13].trim() || null,
        contatoClienteEmail: (campos[14] && campos[14].trim() !== '') ? campos[14].trim() : null,
        contatoClienteTeams: (campos[15] && campos[15].trim() !== '') ? campos[15].trim() : null,
        contatoClienteTelefone: (campos[16] && campos[16].trim() !== '') ? campos[16].trim() : null,
        contatoMatilhaEmail: (campos[17] && campos[17].trim() !== '') ? campos[17].trim() : null,
        contatoMatilhaTeams: (campos[18] && campos[18].trim() !== '') ? campos[18].trim() : null,
        contatoMatilhaTelefone: (campos[19] && campos[19].trim() !== '') ? campos[19].trim() : null,
        clienteId: campos[20].trim() || 'cme1imy560000a71egelnpyzy' // ID padrão se não informado
      }
      
      profissionais.push(profissional)
    }
    
    console.log(`📊 Encontrados ${profissionais.length} profissionais para importar`)
    
    // Verificar se há profissionais para importar
    if (profissionais.length === 0) {
      console.log('⚠️ Nenhum profissional válido encontrado no CSV')
      return
    }
    
    // Mostrar preview dos primeiros registros
    console.log('\n📋 Preview dos primeiros registros:')
    profissionais.slice(0, 3).forEach((prof, index) => {
      console.log(`${index + 1}. ${prof.nome} - ${prof.especialidade} - ${prof.email}`)
    })
    
    console.log('\n⚠️ ATENÇÃO: Esta operação irá ADICIONAR os profissionais ao banco existente!')
    console.log('⚠️ Se quiser substituir, limpe a tabela antes.')
    
    // Importar para o banco
    let sucessos = 0
    let erros = 0
    
    for (const prof of profissionais) {
      try {
        // Verificar se já existe profissional com este email
        const existente = await prisma.profissional.findUnique({
          where: { email: prof.email }
        })
        
        if (existente) {
          console.log(`⚠️ Profissional já existe: ${prof.nome} (${prof.email})`)
          continue
        }
        
        // Criar profissional
        await prisma.profissional.create({
          data: prof
        })
        
        console.log(`✅ Importado: ${prof.nome}`)
        sucessos++
        
      } catch (error) {
        console.error(`❌ Erro ao importar ${prof.nome}:`, error.message)
        erros++
      }
    }
    
    console.log('\n🎉 Importação concluída!')
    console.log(`✅ Sucessos: ${sucessos}`)
    console.log(`❌ Erros: ${erros}`)
    console.log(`📊 Total processado: ${profissionais.length}`)
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar importação
importarCSV().catch(console.error)
