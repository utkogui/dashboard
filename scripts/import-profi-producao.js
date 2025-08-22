import { PrismaClient } from '@prisma/client'
import fs from 'fs'
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

async function importarProfissionais() {
  try {
    console.log('🚀 Iniciando importação limpa de profissionais para produção...')
    
    // Ler o arquivo CSV
    const csvPath = path.join(process.cwd(), 'profi.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    // Pular o cabeçalho
    const dataLines = lines.slice(1)
    
    console.log(`📊 Total de linhas de dados: ${dataLines.length}`)
    
    let sucessos = 0
    let ignorados = 0
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i]
      if (!line.trim()) continue
      
      // Parsear a linha CSV (separador: ;)
      const columns = line.split(';')
      
      // Verificar se temos dados suficientes e se não é uma linha vazia
      if (columns.length < 22 || !columns[1]?.trim()) {
        ignorados++
        continue
      }
      
      // Extrair dados (índices baseados no cabeçalho)
      const [
        id, nome, email, especialidade, perfil, especialidadeEspecifica,
        valorHora, status, dataInicio, tipoContrato, valorFechado,
        periodoFechado, valorPago, tags, contatoClienteEmail,
        contatoClienteTeams, contatoClienteTelefone, contatoMatilhaEmail,
        contatoMatilhaTeams, contatoMatilhaTelefone, clienteId,
        createdAt, updatedAt
      ] = columns
      
      // Validar dados obrigatórios
      if (!nome || !email || !especialidade || !clienteId) {
        ignorados++
        continue
      }
      
      // Preparar dados para inserção
      const dadosProfissional = {
        // id será gerado automaticamente pelo Prisma (cuid())
        nome: nome.trim(),
        email: email.trim(),
        especialidade: especialidade.trim(),
        perfil: perfil?.trim() || null,
        especialidadeEspecifica: especialidadeEspecifica?.trim() || null,
        valorHora: valorHora ? parseFloat(valorHora.replace(',', '.')) : null,
        status: status?.trim() || 'ativo',
        dataInicio: dataInicio?.trim() || null,
        tipoContrato: tipoContrato?.trim() || 'hora',
        valorFechado: valorFechado ? parseFloat(valorFechado.replace(',', '.')) : null,
        periodoFechado: periodoFechado?.trim() || null,
        valorPago: valorPago ? parseFloat(valorPago.replace(',', '.')) : 0,
        tags: tags?.trim() || null,
        contatoClienteEmail: contatoClienteEmail?.trim() || null,
        contatoClienteTeams: contatoClienteTeams?.trim() || null,
        contatoClienteTelefone: contatoClienteTelefone?.trim() || null,
        contatoMatilhaEmail: contatoMatilhaEmail?.trim() || null,
        contatoMatilhaTeams: contatoMatilhaTeams?.trim() || null,
        contatoMatilhaTelefone: contatoMatilhaTelefone?.trim() || null,
        clienteId: clienteId.trim(),
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
      
      // Criar novo profissional (sem verificar duplicatas)
      await prisma.profissional.create({
        data: dadosProfissional
      })
      
      console.log(`✅ Profissional ${dadosProfissional.nome} criado`)
      sucessos++
    }
    
    console.log('\n📋 Resumo da importação:')
    console.log(`✅ Sucessos: ${sucessos}`)
    console.log(`⚠️  Linhas ignoradas: ${ignorados}`)
    console.log(`📊 Total processado: ${sucessos + ignorados}`)
    
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
importarProfissionais()
