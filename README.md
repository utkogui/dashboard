# Bodyshop Manager - Dashboard de Controle de Profissionais

Um dashboard completo para controle de profissionais alocados em bodyshop, desenvolvido com React, TypeScript e Chakra UI.

## 🚀 Funcionalidades

### 📊 Dashboard Principal
- **Visão Geral**: Cards com estatísticas em tempo real
- **Alertas**: Contratos vencendo nos próximos 30 dias
- **Gráficos**: Rentabilidade por profissional e status dos profissionais
- **Progresso**: Barra de progresso para contratos vencendo

### 👥 Gestão de Profissionais
- **Listagem**: Tabela completa com todos os profissionais
- **Busca**: Filtro por nome, especialidade ou email
- **CRUD**: Adicionar, editar e remover profissionais
- **Status**: Controle de status (Ativo, Férias, Inativo)

### 📋 Gestão de Contratos
- **Detalhamento**: Informações completas dos contratos
- **Rentabilidade**: Cálculo automático de margem de lucro
- **Períodos**: Controle de datas de início e fim
- **Valores**: Receita, custo e lucro por contrato

### 🏢 Gestão de Clientes
- **Cadastro**: Informações completas dos clientes
- **Contratos**: Número de contratos ativos por cliente
- **Valores**: Total de receita por cliente

### 📈 Relatórios
- **Evolução Mensal**: Gráfico de linha com receita, custo e lucro
- **Rentabilidade por Cliente**: Gráfico de barras
- **Distribuição por Especialidade**: Gráfico de pizza
- **Performance**: Análise individual por profissional

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Chakra UI** - Biblioteca de componentes
- **React Router** - Navegação
- **Recharts** - Gráficos e visualizações
- **Date-fns** - Manipulação de datas
- **Lucide React** - Ícones
- **Vite** - Build tool

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd dash_ftd
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
   - Por padrão, o projeto usa SQLite como banco de dados
   - Para usar PostgreSQL (Supabase ou Neon), siga as instruções na seção [Migração para PostgreSQL](#-migração-para-postgresql)

4. **Execute o projeto**
```bash
npm run dev:full
```

5. **Acesse no navegador**
```
http://localhost:5173
```

## 🎯 Como Usar

### Dashboard Principal
- Visualize estatísticas gerais no topo
- Acompanhe contratos vencendo nos próximos 30 dias
- Analise gráficos de rentabilidade e distribuição

### Gestão de Profissionais
- Clique em "Novo Profissional" para adicionar
- Use a busca para filtrar profissionais
- Clique no ícone de edição para modificar dados
- Visualize status com badges coloridos

### Gestão de Contratos
- Monitore rentabilidade em tempo real
- Acompanhe margens de lucro por contrato
- Visualize períodos e valores
- Use filtros para encontrar contratos específicos

### Relatórios
- Selecione o período desejado
- Analise evolução mensal
- Compare performance entre clientes
- Visualize distribuição por especialidade

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🎨 Personalização

### Cores
As cores podem ser personalizadas no arquivo `src/main.tsx`:

```typescript
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      900: '#0d47a1',
    },
  },
})
```

### Dados
Os dados mock estão em `src/data/mockData.ts` e podem ser substituídos por:
- API REST
- Banco de dados
- Arquivo JSON
- LocalStorage

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 📊 Estrutura de Dados

### Profissional
```typescript
interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  valorHora: number;
  status: 'ativo' | 'inativo' | 'ferias';
  dataAdmissao: string;
}
```

### Contrato
```typescript
interface Contrato {
  id: string;
  profissionalId: string;
  clienteId: string;
  dataInicio: string;
  dataFim: string;
  valorHora: number;
  horasMensais: number;
  status: 'ativo' | 'encerrado' | 'pendente';
  valorTotal: number;
  valorRecebido: number;
  valorPago: number;
  margemLucro: number;
  observacoes?: string;
}
```

### Cliente
```typescript
interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  endereco: string;
}
```

## 🔄 Migração para PostgreSQL

Este projeto pode ser migrado de SQLite para PostgreSQL (Supabase ou Neon) seguindo os passos abaixo:

### 1. Criar conta e banco de dados

#### Opção 1: Supabase
1. Acesse [Supabase](https://supabase.com/) e crie uma conta
2. Crie um novo projeto
3. Anote a URL de conexão e a senha do banco de dados

#### Opção 2: Neon
1. Acesse [Neon](https://neon.tech/) e crie uma conta
2. Crie um novo projeto
3. Anote a URL de conexão do banco de dados

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```bash
# Configuração do banco de dados
# Substitua pela sua URL de conexão do Supabase ou Neon
DATABASE_URL="postgresql://postgres:password@db.example.com:5432/dash_ftd?schema=public"

# Configuração do servidor
PORT=3001

# Configuração do JWT
JWT_SECRET="seu_segredo_jwt_aqui_altere_em_producao"
JWT_EXPIRATION="24h"

# Configuração de CORS (separados por vírgula)
CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"

# Ambiente
NODE_ENV="development"
```

### 3. Migrar o banco de dados

Execute os scripts de migração na seguinte ordem:

```bash
# Exportar dados do SQLite
npm run db:export

# Configurar PostgreSQL e criar tabelas
npm run db:setup

# Importar dados para PostgreSQL
npm run db:import

# Testar a conexão
npm run db:test
```

Ou use o comando único para executar todos os passos:

```bash
npm run db:migrate
```

### 4. Executar o projeto com PostgreSQL

```bash
npm run dev:full
```

## 🚀 Deploy

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
gh-pages -d dist
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ para controle eficiente de profissionais em bodyshop.
