import { PrismaClient } from '@prisma/client'
import XLSX from 'xlsx'
import path from 'path'
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

async function importarProfissionaisExcel() {
  try {
    console.log('🚀 Iniciando importação de profissionais do Excel para produção...')
    
    // Ler o arquivo Excel
    const excelPath = path.join(process.cwd(), 'banco_profi.xls')
    const workbook = XLSX.readFile(excelPath)
    
    // Pegar a primeira planilha
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Converter para JSON com cabeçalhos (mais confiável)
    const dadosComCabecalho = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`📊 Total de linhas válidas no Excel: ${dadosComCabecalho.length}`)
    
    let sucessos = 0
    let ignorados = 0
    let erros = 0
    
    for (let i = 0; i < dadosComCabecalho.length; i++) {
      const row = dadosComCabecalho[i]
      
      try {
        // Verificar se a linha tem dados válidos
        if (!row.nome || !row.email || !row.especialidade) {
          console.log(`⚠️  Linha ${i + 1} ignorada - dados obrigatórios faltando`)
          ignorados++
          continue
        }
        
        // Preparar dados para inserção
        const dadosProfissional = {
          // id será gerado automaticamente pelo Prisma (cuid())
          nome: String(row.nome).trim(),
          email: String(row.email).trim(),
          especialidade: String(row.especialidade).trim(),
          perfil: row.perfil ? String(row.perfil).trim() : null,
          especialidadeEspecifica: row.especialidadeEspecifica ? String(row.especialidadeEspecifica).trim() : null,
          valorHora: row.valorHora ? parseFloat(String(row.valorHora).replace(',', '.')) : null,
          status: row.status ? String(row.status).trim() : 'ativo',
          dataInicio: row.dataInicio ? String(row.dataInicio).trim() : null,
          tipoContrato: row.tipoContrato ? String(row.tipoContrato).trim() : 'hora',
          valorFechado: row.valorFechado ? parseFloat(String(row.valorFechado).replace(',', '.')) : null,
          periodoFechado: row.periodoFechado ? String(row.periodoFechado).trim() : null,
          valorPago: row.valorPago ? parseFloat(String(row.valorPago).replace(',', '.')) : 0,
          tags: row.tags ? String(row.tags).trim() : null,
          contatoClienteEmail: row.contatoClienteEmail ? String(row.contatoClienteEmail).trim() : null,
          contatoClienteTeams: row.contatoClienteTeams ? String(row.contatoClienteTeams).trim() : null,
          contatoClienteTelefone: row.contatoClienteTelefone ? String(row.contatoClienteTelefone).trim() : null,
          contatoMatilhaEmail: row.contatoMatilhaEmail ? String(row.contatoMatilhaEmail).trim() : null,
          contatoMatilhaTeams: row.contatoMatilhaTeams ? String(row.contatoMatilhaTeams).trim() : null,
          contatoMatilhaTelefone: row.contatoMatilhaTelefone ? String(row.contatoMatilhaTelefone).trim() : null,
          // Usar um clienteId padrão já que não está no Excel
          clienteId: 'cme1imy560000a71egelnpyzy', // Cliente padrão baseado no CSV anterior
          // createdAt e updatedAt serão gerados automaticamente pelo Prisma
        }
        
        // Verificar se o cliente existe
        const clienteExiste = await prisma.clienteSistema.findUnique({
          where: { id: dadosProfissional.clienteId }
        })
        
        if (!clienteExiste) {
          console.log(`❌ Cliente ${dadosProfissional.clienteId} não encontrado para profissional ${dadosProfissional.nome}`)
          ignorados++
          continue
        }
        
        // Criar novo profissional
        await prisma.profissional.create({
          data: dadosProfissional
        })
        
        console.log(`✅ Profissional ${dadosProfissional.nome} criado`)
        sucessos++
        
      } catch (error) {
        console.error(`❌ Erro na linha ${i + 1}:`, error.message)
        erros++
      }
    }
    
    console.log('\n📋 Resumo da importação:')
    console.log(`✅ Sucessos: ${sucessos}`)
    console.log(`⚠️  Linhas ignoradas: ${ignorados}`)
    console.log(`❌ Erros: ${erros}`)
    console.log(`📊 Total processado: ${sucessos + ignorados + erros}`)
    
    // Verificar total de profissionais no banco
    const totalProfissionais = await prisma.profissional.count()
    console.log(`🎯 Total de profissionais no banco: ${totalProfissionais}`)
    
    if (totalProfissionais === 21) {
      console.log('🎉 Importação concluída com sucesso! Todos os 21 profissionais foram importados.')
    } else {
      console.log(`⚠️  Esperado 21 profissionais, mas encontrado ${totalProfissionais}`)
    }
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar importação
importarProfissionaisExcel()
