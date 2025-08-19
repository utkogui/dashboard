// Configuração de variáveis de ambiente para o projeto
// Copie este arquivo para .env e ajuste os valores conforme necessário

/**
 * Para Supabase, a URL será algo como:
 * postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
 * 
 * Para Neon, a URL será algo como:
 * postgresql://[USER]:[PASSWORD]@[ENDPOINT]/[DATABASE]?sslmode=require
 */

module.exports = {
  // Configuração do banco de dados
  DATABASE_URL: "postgresql://postgres:password@db.example.com:5432/dash_ftd?schema=public",
  
  // Configuração do servidor
  PORT: 3001,
  
  // Configuração do JWT
  JWT_SECRET: "seu_segredo_jwt_aqui_altere_em_producao",
  JWT_EXPIRATION: "24h",
  
  // Configuração de CORS (separados por vírgula)
  CORS_ORIGIN: "http://localhost:5173,http://127.0.0.1:5173",
  
  // Ambiente
  NODE_ENV: "development"
};
