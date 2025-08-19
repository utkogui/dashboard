/**
 * Script para importar dados para PostgreSQL (Supabase ou Neon)
 * 
 * Este script importa os dados exportados pelo script migrate-to-postgres.js
 * para o banco de dados PostgreSQL configurado no arquivo .env.
 * 
 * Instruções:
 * 1. Certifique-se de que o arquivo .env está configurado com a URL de conexão do PostgreSQL
 * 2. Execute as migrações do Prisma para criar as tabelas no PostgreSQL: npx prisma migrate deploy
 * 3. Execute este script para importar os dados
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Configuração
const INPUT_DIR = './migration-data';

// Inicializar cliente Prisma para PostgreSQL (usando a URL do .env)
const prisma = new PrismaClient();

/**
 * Função para importar dados de uma tabela
 */
async function importTable(tableName, importFunction) {
  try {
    const inputFile = path.join(INPUT_DIR, `${tableName}.json`);
    
    if (!fs.existsSync(inputFile)) {
      console.log(`  Arquivo ${inputFile} não encontrado, pulando.`);
      return;
    }
    
    console.log(`Importando tabela: ${tableName}...`);
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    if (data.length === 0) {
      console.log(`  Tabela ${tableName} está vazia, pulando.`);
      return;
    }
    
    await importFunction(data);
    console.log(`  ✅ Importados ${data.length} registros para ${tableName}`);
  } catch (error) {
    console.error(`  ❌ Erro ao importar tabela ${tableName}:`, error);
  }
}

/**
 * Função principal para importar todos os dados
 */
async function importAllData() {
  try {
    console.log('Iniciando importação de dados para PostgreSQL...');
    
    // Importar tabelas na ordem correta (respeitando dependências)
    await importTable('clientesSistema', async (data) => {
      for (const item of data) {
        await prisma.clienteSistema.create({
          data: {
            id: item.id,
            nome: item.nome,
            descricao: item.descricao,
            ativo: item.ativo,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        });
      }
    });
    
    await importTable('usuarios', async (data) => {
      for (const item of data) {
        await prisma.usuario.create({
          data: {
            id: item.id,
            email: item.email,
            senha: item.senha,
            tipo: item.tipo,
            clienteId: item.clienteId,
            ativo: item.ativo,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        });
      }
    });
    
    await importTable('profissionais', async (data) => {
      for (const item of data) {
        await prisma.profissional.create({
          data: {
            id: item.id,
            nome: item.nome,
            email: item.email,
            especialidade: item.especialidade,
            perfil: item.perfil,
            especialidadeEspecifica: item.especialidadeEspecifica,
            valorHora: item.valorHora,
            status: item.status,
            dataInicio: item.dataInicio,
            tipoContrato: item.tipoContrato,
            valorFechado: item.valorFechado,
            periodoFechado: item.periodoFechado,
            valorPago: item.valorPago,
            tags: item.tags,
            contatoClienteEmail: item.contatoClienteEmail,
            contatoClienteTeams: item.contatoClienteTeams,
            contatoClienteTelefone: item.contatoClienteTelefone,
            contatoMatilhaEmail: item.contatoMatilhaEmail,
            contatoMatilhaTeams: item.contatoMatilhaTeams,
            contatoMatilhaTelefone: item.contatoMatilhaTelefone,
            clienteId: item.clienteId,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        });
      }
    });
    
    await importTable('clientes', async (data) => {
      for (const item of data) {
        await prisma.cliente.create({
          data: {
            id: item.id,
            nome: item.nome,
            empresa: item.empresa,
            email: item.email,
            telefone: item.telefone,
            endereco: item.endereco,
            anoInicio: item.anoInicio,
            segmento: item.segmento,
            tamanho: item.tamanho,
            clienteId: item.clienteId,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        });
      }
    });
    
    await importTable('contratos', async (data) => {
      for (const item of data) {
        await prisma.contrato.create({
          data: {
            id: item.id,
            nomeProjeto: item.nomeProjeto,
            codigoContrato: item.codigoContrato,
            clienteId: item.clienteId,
            clienteSistemaId: item.clienteSistemaId,
            dataInicio: item.dataInicio,
            dataFim: item.dataFim,
            tipoContrato: item.tipoContrato,
            valorContrato: item.valorContrato,
            valorImpostos: item.valorImpostos,
            percentualImpostos: item.percentualImpostos,
            status: item.status,
            observacoes: item.observacoes,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        });
      }
    });
    
    await importTable('contratoProfissionais', async (data) => {
      for (const item of data) {
        await prisma.contratoProfissional.create({
          data: {
            id: item.id,
            contratoId: item.contratoId,
            profissionalId: item.profissionalId,
            valorHora: item.valorHora,
            horasMensais: item.horasMensais,
            valorFechado: item.valorFechado,
            periodoFechado: item.periodoFechado,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        });
      }
    });
    
    await importTable('despesasAdicionais', async (data) => {
      for (const item of data) {
        await prisma.despesaAdicional.create({
          data: {
            id: item.id,
            contratoId: item.contratoId,
            descricao: item.descricao,
            valor: item.valor,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        });
      }
    });
    
    await importTable('clienteInteresses', async (data) => {
      for (const item of data) {
        await prisma.clienteInteresse.create({
          data: {
            id: item.id,
            clienteId: item.clienteId,
            contratoId: item.contratoId,
            profissionalId: item.profissionalId,
            interesse: item.interesse,
            comentario: item.comentario,
            createdAt: new Date(item.createdAt)
          }
        });
      }
    });
    
    await importTable('clienteNotas', async (data) => {
      for (const item of data) {
        await prisma.clienteNota.create({
          data: {
            id: item.id,
            clienteId: item.clienteId,
            contratoId: item.contratoId,
            profissionalId: item.profissionalId,
            texto: item.texto,
            createdAt: new Date(item.createdAt)
          }
        });
      }
    });
    
    await importTable('solicitacoesProfissional', async (data) => {
      for (const item of data) {
        await prisma.solicitacaoProfissional.create({
          data: {
            id: item.id,
            clienteId: item.clienteId,
            especialidade: item.especialidade,
            senioridade: item.senioridade,
            descricao: item.descricao,
            status: item.status,
            createdAt: new Date(item.createdAt)
          }
        });
      }
    });
    
    console.log('\nImportação concluída com sucesso! 🎉');
    
  } catch (error) {
    console.error('Erro durante a importação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar importação
importAllData().catch(console.error);
