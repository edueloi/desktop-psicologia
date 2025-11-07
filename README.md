# 🧠 PsychDesk Pro v3.0# PsychDesk - Sistema de Gestão para Psicologia



Sistema completo de gestão para consultórios de psicologia.Sistema desktop completo para gestão de consultório de psicologia, construído com Electron, React, Express e SQLite.



## 🚀 Início Rápido---



```bash## ⚠️ IMPORTANTE: Vendo Erros no VSCode?

# Executar o sistema (método mais simples)

start-simple.bat**Isso é NORMAL antes de instalar as dependências!** ✅

```

Se você vê erros como "Cannot find module 'react'" ou "JSX tag requires...", é porque o `node_modules` ainda não existe.

O sistema abrirá automaticamente no navegador em `http://localhost:5173`

**Solução simples:**

## 📋 Funcionalidades Completas```bash

npm install

### ✅ 12 Páginas Implementadas```



1. **Dashboard** - Estatísticas, métricas e visão geralAguarde 3-5 minutos e **todos os erros desaparecerão**! 🎉

2. **Pacientes** - Gerenciamento completo

3. **Agenda** - Calendário de consultas👉 **Veja detalhes em: [ERROS_NORMAIS.md](ERROS_NORMAIS.md)**

4. **Faturamento** - Controle financeiro

5. **Kanban** - Múltiplos quadros organizacionais---

6. **Relatórios** - Análises e exportações

7. **Configurações** - Personalização do sistema## 🚀 Tecnologias

8. **Perfil** - Dados pessoais (4 abas)

9. **Notificações** - Central completa com filtros### Frontend

10. **Busca** - Busca inteligente global- **React 18** com TypeScript

11. **Ajuda** - FAQ e suporte- **Vite** para build rápido

12. **Login** - Autenticação- **Material-UI (MUI)** para componentes de interface

- **React Hook Form + Zod** para validação de formulários

### 🎨 Design- **React Router** para navegação

- **Axios** para requisições HTTP

- ✅ Tema claro profissional

- ✅ Fundo branco (#F5F7FA)### Backend Local

- ✅ Cor primária: #2BC7D4- **Express** rodando dentro do Electron

- ✅ Interface limpa e moderna- **SQLite** com better-sqlite3 (compatível com Node 14)

- ✅ 100% responsivo- **Knex** para migrations e queries

- **bcrypt** para hash de senhas

## 🛠️ Tecnologias- **JWT** para autenticação



- React 18 + TypeScript + Vite### Desktop

- Material-UI v5- **Electron 22** (compatível com Node 14)

- Node.js + Express- Comunicação segura via IPC

- SQLite + Knex.js- Build para Windows com electron-builder

- Electron (Desktop)

- React Beautiful DnD## 📋 Pré-requisitos



## 📖 Como Usar- Node.js 14.x ou superior

- npm ou yarn

### 1. Login

Use qualquer email/senha (auth mockado para desenvolvimento)## 🔧 Instalação



### 2. Dashboard1. Clone o repositório ou extraia os arquivos do projeto

- Veja estatísticas do mês

- Acompanhe métricas importantes2. Instale as dependências:

- Atividades recentes```bash

npm install

### 3. Pacientes```

- Cadastre novos pacientes

- Edite informações3. O banco de dados será criado automaticamente na primeira execução

- Histórico completo

## 🎯 Como Usar

### 4. Agenda

- Calendário visual### Desenvolvimento

- Agende consultas

- Reagende ou cancele```bash

npm run dev

### 5. Kanban```

- Crie quadros personalizados

- Organize tarefasEste comando:

- Drag and drop- Inicia o Vite em http://localhost:5173

- Aguarda o Vite estar pronto

### 6. Notificações- Inicia o Electron com hot reload

- Central de notificações- O servidor Express roda na porta 3456

- Filtre por tipo (Consulta, Pagamento, etc)

- Marque como lida### Build para Produção



### 7. Busca```bash

- Busca global no sistema# Build da aplicação React

- Filtre por categorianpm run build

- Resultados instantâneos

# Build do instalador Electron

### 8. Ajudanpm run build:electron

- FAQ completo```

- 20+ perguntas respondidas

- Contato com suporteO instalador será gerado em `dist-electron/`



## 📁 Estrutura### Acesso Inicial



```**Credenciais padrão:**

desktop_psicologia/- Email: `admin@psychdesk.com`

├── app/src/- Senha: `admin123`

│   ├── components/    # Layout, etc

│   ├── pages/         # 12 páginas⚠️ **Altere essas credenciais após o primeiro acesso!**

│   ├── contexts/      # AuthContext

│   ├── services/      # API## 📁 Estrutura do Projeto

│   └── theme/         # Tema

├── server/```

│   ├── routes/        # API routespsychdesk/

│   ├── migrations/    # DB migrations├── app/                    # Frontend React + Vite

│   └── index.js       # Server│   ├── src/

├── data/db/           # SQLite database│   │   ├── components/     # Componentes reutilizáveis

└── start-simple.bat   # Iniciar tudo│   │   ├── contexts/       # Context API (Auth)

```│   │   ├── pages/          # Páginas da aplicação

│   │   ├── services/       # API client (axios)

## 🎯 Comandos│   │   └── App.tsx         # Componente principal

│   └── index.html

```bash│

# Desenvolvimento├── electron/               # Processo principal do Electron

npm run dev│   ├── main.js            # Janela e lifecycle

│   └── preload.js         # Bridge seguro IPC

# Build│

npm run build├── server/                 # Backend Express local

│   ├── routes/            # Rotas da API

# Electron│   │   ├── auth.js        # Login e autenticação

npm run electron│   │   ├── patients.js    # CRUD de pacientes

```│   │   ├── appointments.js # Agendamentos

│   │   └── dashboard.js   # Estatísticas

## 💾 Banco de Dados│   ├── migrations/        # Migrations do Knex

│   ├── seeds/             # Seeds iniciais

SQLite local em `data/db/database.sqlite`│   └── index.js           # Servidor Express

│

**Tabelas:**├── data/                   # Dados locais (gitignored)

- users│   ├── db/                # Banco SQLite

- patients│   └── files/             # Anexos de pacientes

- appointments│

- billing├── knexfile.js            # Config do Knex

- kanban_boards├── package.json

- kanban_columns├── tsconfig.json

- kanban_cards└── vite.config.ts

```

## 🔧 Portas

## 🗄️ Modelo de Dados

- **Frontend:** http://localhost:5173

- **Backend:** http://localhost:3000### Users (Usuários)

- id, name, email, password_hash, role, created_at

## 📝 Versão 3.0

### Patients (Pacientes)

### Novo nesta versão:- id, name, birth_date, cpf, phone, email, address_json, notes, created_at, updated_at

- ✅ Tema claro completo

- ✅ Notificações interativas### Appointments (Agendamentos)

- ✅ Busca inteligente- id, patient_id, start_at, end_at, status, notes

- ✅ Página de ajuda/FAQ

- ✅ Design 100% profissional### Session Notes (Notas de Sessão)

- ✅ Performance otimizada- id, appointment_id, content, created_at



## 🆘 Precisa de Ajuda?### Files (Arquivos)

- id, patient_id, file_name, mime_type, size, stored_path, created_at

Acesse a página **Ajuda** dentro do sistema!

## 🎨 Funcionalidades

---

### ✅ Implementadas

**PsychDesk Pro v3.0** - Sua prática clínica, organizada. 🧠✨

- **Autenticação**
  - Login com email e senha
  - JWT com expiração de 24h
  - Proteção de rotas

- **Dashboard**
  - Total de pacientes
  - Sessões do dia
  - Faltas do mês
  - Aniversários próximos

- **Gestão de Pacientes**
  - Cadastro completo em etapas
  - Edição e exclusão
  - Busca por nome
  - DataGrid com paginação
  - Campos: dados pessoais, contato, endereço, observações

- **Layout Profissional**
  - AppBar com gradiente
  - Drawer lateral com navegação
  - Tema Material-UI personalizado
  - Design responsivo

### 🚧 Próximas Features

- **Agenda**
  - Calendário mensal/semanal
  - Criação de consultas
  - Status (agendado, realizado, falta, cancelado)
  - Notificações de compromissos

- **Notas de Sessão**
  - Editor rico de texto
  - Anexar a consultas
  - Busca em notas

- **Relatórios**
  - PDF de pacientes
  - PDF de sessões
  - Estatísticas mensais/anuais
  - Exportação de dados

- **Arquivos**
  - Upload de documentos
  - Visualização inline
  - Organização por paciente

- **Backup/Restore**
  - Exportar dados para ZIP
  - Importar backup
  - Agendamento automático

- **Configurações**
  - Dados do profissional (CRP, etc.)
  - Tema claro/escuro
  - Idioma
  - Notificações

## 🔒 Segurança

- Senhas com hash bcrypt (salt rounds: 10)
- JWT para autenticação stateless
- Context isolation no Electron
- Banco de dados local (privacidade total)
- Sem conexão externa necessária

## 📦 Dados Locais

Todos os dados são armazenados localmente em:
- **Desenvolvimento:** `data/db/app.db`
- **Produção:** `%APPDATA%/psychdesk/data/db/app.db` (Windows)

Para backup manual, basta copiar a pasta `data/`

## 🛠️ Scripts Úteis

```bash
# Executar migrations
npm run migrate:latest

# Reverter última migration
npm run migrate:rollback

# Executar seeds
npm run seed:run

# Modo desenvolvimento
npm run dev

# Build produção
npm run build

# Build instalador
npm run build:electron
```

## 🐛 Troubleshooting

### Erro ao instalar dependências
- Certifique-se de usar Node 14+
- Delete `node_modules` e `package-lock.json`, rode `npm install` novamente

### Banco não inicializa
- Verifique se a pasta `data/db` foi criada
- Delete o arquivo `app.db` para recriar
- Rode `npm run migrate:latest`

### Electron não abre
- Verifique se o Vite está rodando em http://localhost:5173
- Aguarde alguns segundos após `npm run dev`
- Verifique o console por erros

## 📝 Licença

MIT - Livre para uso pessoal e comercial

## 👨‍💻 Autor

Eduardo - 2025

---

**PsychDesk** - Gestão profissional, 100% local e privada 🔒
