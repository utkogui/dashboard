/**
 * Script para configurar o schema.prisma para Neon PostgreSQL
 * 
 * Este script configura o schema.prisma para usar Neon PostgreSQL em vez de SQLite.
 * 
 * Instruções:
 * 1. Execute este script para configurar o schema.prisma para Neon PostgreSQL
 * 2. Configure o arquivo .env com a URL de conexão do Neon PostgreSQL
 * 3. Execute npx prisma generate para atualizar o cliente Prisma
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const backupSchemaPath = path.join(__dirname, '../prisma/schema.sqlite.prisma');
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

// Verificar se já existe um backup do schema.prisma
if (!fs.existsSync(backupSchemaPath)) {
  console.log('📦 Criando backup do schema.prisma atual para schema.sqlite.prisma...');
  if (fs.existsSync(schemaPath)) {
    fs.copyFileSync(schemaPath, backupSchemaPath);
  }
}

// Conteúdo do novo schema.prisma para Neon PostgreSQL
const neonSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Recomendado para o Neon
}

model Profissional {
  id                String     @id @default(cuid())
  nome              String
  email             String     @unique
  especialidade     String
  perfil            String?    // JUNIOR, PLENO, SENIOR, Especialista
  especialidadeEspecifica String? // Service Designer, Research, UX Writer, etc.
  valorHora         Float?     // Opcional agora (pode ser null para contratos fechados)
  status            String     @default("ativo") // ativo, inativo, ferias
  dataInicio        String     // Data de início (renomeado de dataAdmissao)
  tipoContrato      String     @default("hora") // hora, fechado
  valorFechado      Float?     // Valor do contrato fechado
  periodoFechado    String?    // mensal, trimestral, semestral, anual
  valorPago         Float      // Valor bruto pago ao profissional
  tags              String?    // Tags separadas por vírgula (ex: "Alocação,Projetos,Bodyshop")
  // Canais de contato do profissional
  contatoClienteEmail    String?
  contatoClienteTeams    String?
  contatoClienteTelefone String?
  contatoMatilhaEmail    String?
  contatoMatilhaTeams    String?
  contatoMatilhaTelefone String?
  clienteId         String     // Cliente do sistema que possui este profissional
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  // Relacionamentos
  contratos         ContratoProfissional[]
  cliente           ClienteSistema @relation(fields: [clienteId], references: [id], onDelete: Cascade)

  @@map("profissionais")
}

model Cliente {
  id          String     @id @default(cuid())
  nome        String
  empresa     String
  email       String     @unique
  telefone    String?
  endereco    String?
  anoInicio   Int        // Ano de início do relacionamento com a Matilha
  segmento    String     // Segmento de atuação
  tamanho     String     @default("Média") // Pequena, Média, Grande
  clienteId   String     // Cliente do sistema que possui este cliente
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relacionamentos
  contratos   Contrato[]
  cliente     ClienteSistema @relation(fields: [clienteId], references: [id], onDelete: Cascade)

  @@map("clientes")
}

model Contrato {
  id                 String   @id @default(cuid())
  nomeProjeto        String   // Nome do projeto
  codigoContrato     String?  // Código do contrato
  clienteId          String   // Cliente de negócio (relacionado ao Cliente)
  clienteSistemaId   String   // Cliente do sistema que possui este contrato
  dataInicio         String
  dataFim            String?
  tipoContrato       String   @default("hora") // hora, fechado
  valorContrato      Float    // Valor total do contrato
  valorImpostos      Float    // Valor dos impostos
  percentualImpostos Float    @default(13.0) // Percentual de impostos
  status             String   @default("ativo") // ativo, encerrado, pendente
  observacoes        String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  // Relacionamentos
  cliente            Cliente      @relation(fields: [clienteId], references: [id], onDelete: Cascade)
  clienteSistema     ClienteSistema @relation(fields: [clienteSistemaId], references: [id], onDelete: Cascade)
  profissionais      ContratoProfissional[]
  despesasAdicionais DespesaAdicional[]

  @@map("contratos")
}

model DespesaAdicional {
  id          String   @id @default(cuid())
  contratoId  String
  descricao   String   // Ex: "Software", "Risco", "Infraestrutura"
  valor       Float    // Valor da despesa
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  contrato    Contrato @relation(fields: [contratoId], references: [id], onDelete: Cascade)

  @@map("despesas_adicionais")
}

model ContratoProfissional {
  id             String   @id @default(cuid())
  contratoId     String
  profissionalId String
  valorHora      Float?   // Para contratos por hora
  horasMensais   Int?     // Para contratos por hora
  valorFechado   Float?   // Para contratos fechados
  periodoFechado String?  // mensal, trimestral, semestral, anual
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relacionamentos
  contrato       Contrato     @relation(fields: [contratoId], references: [id], onDelete: Cascade)
  profissional   Profissional @relation(fields: [profissionalId], references: [id], onDelete: Cascade)

  @@unique([contratoId, profissionalId])
  @@map("contrato_profissionais")
}

// ===== NOVAS TABELAS PARA SISTEMA DE LOGIN =====

model Usuario {
  id          String   @id @default(cuid())
  email       String   @unique
  senha       String   // Senha criptografada
  tipo        String   @default("cliente") // admin, cliente
  clienteId   String?  // Null para admin, ID do cliente para usuários cliente
  ativo       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  cliente     ClienteSistema? @relation(fields: [clienteId], references: [id], onDelete: Cascade)

  @@map("usuarios")
}

model ClienteSistema {
  id          String   @id @default(cuid())
  nome        String   // Nome do cliente do sistema (ex: "Matilha", "FTD")
  descricao   String?  // Descrição opcional
  ativo       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  usuarios    Usuario[]
  profissionais Profissional[]
  clientes    Cliente[]
  contratos   Contrato[]
  interesses  ClienteInteresse[]
  notas       ClienteNota[]
  solicitacoes SolicitacaoProfissional[]

  @@map("clientes_sistema")
}

// ===== TABELAS PARA INTERAÇÕES DO CLIENTE (Visão do Cliente) =====

model ClienteInteresse {
  id            String   @id @default(cuid())
  clienteId     String
  contratoId    String
  profissionalId String
  interesse     String   // RENOVAR | REDUZIR | TROCAR | ESPERAR
  comentario    String?
  createdAt     DateTime @default(now())

  cliente       ClienteSistema @relation(fields: [clienteId], references: [id], onDelete: Cascade)

  @@map("cliente_interesses")
}

model ClienteNota {
  id            String   @id @default(cuid())
  clienteId     String
  contratoId    String
  profissionalId String
  texto         String
  createdAt     DateTime @default(now())

  cliente       ClienteSistema @relation(fields: [clienteId], references: [id], onDelete: Cascade)

  @@map("cliente_notas")
}

model SolicitacaoProfissional {
  id            String   @id @default(cuid())
  clienteId     String
  especialidade String
  senioridade   String?
  descricao     String?
  status        String   @default("aberta")
  createdAt     DateTime @default(now())

  cliente       ClienteSistema @relation(fields: [clienteId], references: [id], onDelete: Cascade)

  @@map("solicitacoes_profissional")
}`;

// Conteúdo do arquivo .env.example para Neon PostgreSQL
const envExample = `# Configuração do banco de dados Neon
# Substitua pela sua URL de conexão do Neon
DATABASE_URL="postgresql://user:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Configuração do servidor
PORT=3001

# Configuração do JWT
JWT_SECRET="seu_segredo_jwt_aqui_altere_em_producao"
JWT_EXPIRATION="24h"

# Configuração de CORS (separados por vírgula)
CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"

# Ambiente
NODE_ENV="development"`;

try {
  // Atualizar schema.prisma para Neon PostgreSQL
  console.log('🔄 Atualizando schema.prisma para Neon PostgreSQL...');
  fs.writeFileSync(schemaPath, neonSchema);

  // Criar arquivo .env.example se não existir
  if (!fs.existsSync(envExamplePath)) {
    console.log('📝 Criando arquivo .env.example para Neon PostgreSQL...');
    fs.writeFileSync(envExamplePath, envExample);
  }

  // Verificar se arquivo .env existe
  if (!fs.existsSync(envPath)) {
    console.log('⚠️ O arquivo .env não foi encontrado!');
    console.log('Por favor, crie um arquivo .env com base no .env.example.');
    console.log('Configure a URL de conexão do Neon PostgreSQL no arquivo .env.');
  }

  console.log('✅ Schema.prisma configurado para Neon PostgreSQL com sucesso!');
  console.log('\nPróximos passos:');
  console.log('1. Configure o arquivo .env com a URL de conexão do Neon PostgreSQL');
  console.log('2. Execute: npx prisma generate');
  console.log('3. Execute: npm run neon:setup');
} catch (error) {
  console.error('❌ Erro ao configurar schema.prisma:', error);
  process.exit(1);
}
