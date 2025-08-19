-- CreateTable
CREATE TABLE "public"."profissionais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "perfil" TEXT,
    "especialidadeEspecifica" TEXT,
    "valorHora" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "dataInicio" TEXT NOT NULL,
    "tipoContrato" TEXT NOT NULL DEFAULT 'hora',
    "valorFechado" DOUBLE PRECISION,
    "periodoFechado" TEXT,
    "valorPago" DOUBLE PRECISION NOT NULL,
    "tags" TEXT,
    "contatoClienteEmail" TEXT,
    "contatoClienteTeams" TEXT,
    "contatoClienteTelefone" TEXT,
    "contatoMatilhaEmail" TEXT,
    "contatoMatilhaTeams" TEXT,
    "contatoMatilhaTelefone" TEXT,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "anoInicio" INTEGER NOT NULL,
    "segmento" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL DEFAULT 'Média',
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contratos" (
    "id" TEXT NOT NULL,
    "nomeProjeto" TEXT NOT NULL,
    "codigoContrato" TEXT,
    "clienteId" TEXT NOT NULL,
    "clienteSistemaId" TEXT NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT,
    "tipoContrato" TEXT NOT NULL DEFAULT 'hora',
    "valorContrato" DOUBLE PRECISION NOT NULL,
    "valorImpostos" DOUBLE PRECISION NOT NULL,
    "percentualImpostos" DOUBLE PRECISION NOT NULL DEFAULT 13.0,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."despesas_adicionais" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "despesas_adicionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contrato_profissionais" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "valorHora" DOUBLE PRECISION,
    "horasMensais" INTEGER,
    "valorFechado" DOUBLE PRECISION,
    "periodoFechado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contrato_profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'cliente',
    "clienteId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes_sistema" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_interesses" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "interesse" TEXT NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_interesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cliente_notas" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_notas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."solicitacoes_profissional" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "senioridade" TEXT,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'aberta',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitacoes_profissional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_email_key" ON "public"."profissionais"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "public"."clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contrato_profissionais_contratoId_profissionalId_key" ON "public"."contrato_profissionais"("contratoId", "profissionalId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- AddForeignKey
ALTER TABLE "public"."profissionais" ADD CONSTRAINT "profissionais_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos" ADD CONSTRAINT "contratos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contratos" ADD CONSTRAINT "contratos_clienteSistemaId_fkey" FOREIGN KEY ("clienteSistemaId") REFERENCES "public"."clientes_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."despesas_adicionais" ADD CONSTRAINT "despesas_adicionais_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contrato_profissionais" ADD CONSTRAINT "contrato_profissionais_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "public"."contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contrato_profissionais" ADD CONSTRAINT "contrato_profissionais_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "public"."profissionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_interesses" ADD CONSTRAINT "cliente_interesses_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_notas" ADD CONSTRAINT "cliente_notas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solicitacoes_profissional" ADD CONSTRAINT "solicitacoes_profissional_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes_sistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
