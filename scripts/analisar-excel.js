import XLSX from 'xlsx'
import path from 'path'

function analisarExcel() {
  try {
    console.log('🔍 Analisando estrutura do arquivo Excel...')
    
    // Ler o arquivo Excel
    const excelPath = path.join(process.cwd(), 'banco_profi.xls')
    const workbook = XLSX.readFile(excelPath)
    
    // Pegar a primeira planilha
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    console.log(`📋 Planilha: ${sheetName}`)
    
    // Converter para JSON com cabeçalhos
    const dadosComCabecalho = XLSX.utils.sheet_to_json(worksheet)
    console.log(`📊 Total de linhas com dados: ${dadosComCabecalho.length}`)
    
    // Mostrar as primeiras 3 linhas para entender a estrutura
    console.log('\n📋 Primeiras 3 linhas:')
    dadosComCabecalho.slice(0, 3).forEach((row, index) => {
      console.log(`\n--- Linha ${index + 1} ---`)
      Object.entries(row).forEach(([key, value]) => {
        console.log(`${key}: ${value} (tipo: ${typeof value})`)
      })
    })
    
    // Mostrar todas as chaves disponíveis
    if (dadosComCabecalho.length > 0) {
      console.log('\n🔑 Todas as chaves disponíveis:')
      const chaves = Object.keys(dadosComCabecalho[0])
      chaves.forEach((chave, index) => {
        console.log(`${index}: ${chave}`)
      })
    }
    
    // Converter para array simples para ver a estrutura
    const dadosArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    console.log(`\n📊 Total de linhas (array): ${dadosArray.length}`)
    
    // Mostrar as primeiras 3 linhas como array
    console.log('\n📋 Primeiras 3 linhas (array):')
    dadosArray.slice(0, 3).forEach((row, index) => {
      console.log(`\n--- Linha ${index + 1} ---`)
      row.forEach((cell, cellIndex) => {
        console.log(`Coluna ${cellIndex}: ${cell} (tipo: ${typeof cell})`)
      })
    })
    
  } catch (error) {
    console.error('❌ Erro durante a análise:', error)
  }
}

// Executar análise
analisarExcel()
