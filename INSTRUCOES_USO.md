# 📋 Instruções de Uso - PsychDesk

## 🚀 Como Iniciar o Sistema

### Opção 1: Usando o start-simple.bat (Recomendado)
1. Dê duplo clique no arquivo `start-simple.bat`
2. O sistema iniciará automaticamente em 3 etapas:
   - Backend Server (porta 3456)
   - Vite Dev Server (porta 5174)
   - Electron Desktop App

### Opção 2: Iniciando Manualmente
```powershell
# Terminal 1 - Backend
node server/index.js

# Terminal 2 - Frontend
npm run dev:vite

# Terminal 3 - Electron (após Vite estar rodando)
npm run dev:electron
```

### Opção 3: Usando npm dev (Tudo de uma vez)
```powershell
npm run dev
```

## 🔐 Credenciais de Acesso

**Usuário Admin:**
- Email: `admin@psychdesk.com`
- Senha: `admin123`

## 🔧 Comandos Úteis

### Banco de Dados
```powershell
# Executar migrations (atualizar estrutura do banco)
npm run migrate:latest

# Executar seeds (popular com dados de exemplo)
npm run seed:run

# Reverter última migration
npm run migrate:rollback
```

### Desenvolvimento
```powershell
# Iniciar desenvolvimento completo
npm run dev

# Iniciar apenas Vite
npm run dev:vite

# Iniciar apenas Electron
npm run dev:electron

# Rebuild do better-sqlite3 (em caso de erro de módulo)
npm rebuild better-sqlite3
```

### Build e Produção
```powershell
# Build do frontend
npm run build

# Build do instalador
npm run build:electron
```

## ⚙️ Portas Utilizadas

- **Backend API:** http://localhost:3456
- **Vite Dev Server:** http://localhost:5174
- **Electron:** Carrega do Vite em desenvolvimento

## 🐛 Solução de Problemas Comuns

### Tela Branca ao Abrir
**Causa:** Vite não iniciou ou Electron está tentando conectar na porta errada
**Solução:**
1. Verifique se o Vite está rodando na porta 5174
2. Verifique se o backend está rodando na porta 3456
3. Feche todos os processos e reinicie usando `start-simple.bat`

### Erro 500 no Login
**Causa:** Banco de dados sem dados ou senha incorreta
**Solução:**
```powershell
npm run seed:run
```

### Porta já em uso
**Causa:** Processo anterior não foi encerrado
**Solução:**
```powershell
# Parar todos os processos Node e Electron
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
Get-Process | Where-Object {$_.ProcessName -eq "electron"} | Stop-Process -Force
```

### Erro de módulo better-sqlite3
**Causa:** Versão do Node incompatível
**Solução:**
```powershell
npm rebuild better-sqlite3
```

### Erro de Content Security Policy
**Causa:** Navegador bloqueando recursos por segurança
**Solução:** O arquivo `app/index.html` já possui a CSP configurada corretamente

## 📁 Estrutura de Diretórios

```
desktop_psicologia/
├── app/                    # Frontend React + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # API e serviços
│   │   └── contexts/      # Contextos React (Auth, etc)
│   └── index.html
├── electron/              # Configuração Electron
│   ├── main.js           # Processo principal
│   └── preload.js        # Script de preload
├── server/               # Backend Node.js + Express
│   ├── index.js         # Servidor principal
│   ├── routes/          # Rotas da API
│   ├── migrations/      # Migrations do banco
│   └── seeds/           # Seeds do banco
├── data/                # Dados e banco de dados
│   └── db/             # Banco SQLite
└── start-simple.bat    # Script de inicialização

```

## 🎨 Funcionalidades Disponíveis

- ✅ Login e Autenticação
- ✅ Dashboard com Estatísticas
- ✅ Gerenciamento de Pacientes
- ✅ Agenda de Consultas
- ✅ Calendário
- ✅ Kanban Board
- ✅ Relatórios
- ✅ Faturamento
- ✅ Perfil do Usuário
- ✅ Configurações
- ✅ Notificações
- ✅ Busca Global

## 📝 Notas Importantes

1. **Sempre inicie o backend antes do frontend**
2. **Use o `start-simple.bat` para facilitar o processo**
3. **As credenciais padrão são: admin@psychdesk.com / admin123**
4. **O banco de dados é criado automaticamente em `data/db/`**
5. **Em caso de problemas, execute `npm run seed:run` para resetar os dados**

## 🆘 Suporte

Se encontrar problemas não listados aqui, verifique:
1. Os logs no terminal do backend
2. Os logs no DevTools do Electron (abre automaticamente)
3. Versão do Node.js (recomendado: v14.x ou superior)
