# 🚀 Como Gerar o Instalador Desktop

## Passo a Passo Completo

### 1️⃣ Preparar o Projeto
```powershell
# Instalar todas as dependências
npm install
```

### 2️⃣ Gerar o Build
```powershell
# Criar o build otimizado
npm run build
```

### 3️⃣ Gerar o Instalador
```powershell
# Gerar o instalador do Electron
npm run build:electron
```

### 4️⃣ Encontrar o Instalador
O instalador será gerado em:
```
📁 dist-electron/
   └─ PsychDesk Setup 1.0.0.exe  ← Este é o instalador!
```

---

## 📦 O que será gerado?

### **PsychDesk Setup 1.0.0.exe** (~150-250 MB)
- ✅ Instalador completo para Windows
- ✅ Inclui Node.js, Electron e todas as dependências
- ✅ Inclui banco de dados SQLite
- ✅ Não precisa de VS Code ou Node.js instalado
- ✅ Funciona em qualquer Windows 10/11

---

## 💻 Como Usar em Outra Máquina

### Na máquina destino:
1. **Copie** o arquivo `PsychDesk Setup 1.0.0.exe`
2. **Execute** o instalador
3. **Siga** o assistente de instalação
4. **Pronto!** O PsychDesk estará instalado e funcionando

### Atalhos criados automaticamente:
- 🖥️ Ícone na Área de Trabalho
- 📋 Menu Iniciar
- ➕ Opção "Desinstalar" no Painel de Controle

---

## 🔧 Customizar o Instalador

### Alterar ícone do aplicativo:
1. Crie uma pasta `build/` na raiz do projeto
2. Adicione um arquivo `icon.ico` (256x256 pixels)
3. Refaça o build

### Alterar nome e versão:
Edite o `package.json`:
```json
{
  "name": "psychdesk",
  "version": "1.0.0",  ← Mudar versão aqui
  "build": {
    "productName": "PsychDesk"  ← Mudar nome aqui
  }
}
```

---

## 🐛 Problemas Comuns

### Erro: "electron-builder not found"
```powershell
npm install electron-builder --save-dev
```

### Erro: "Cannot find module"
```powershell
# Limpar e reinstalar
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Build muito lento?
- Normal! O primeiro build leva 5-10 minutos
- Builds seguintes são mais rápidos (cache)

---

## 📊 Tamanhos dos Arquivos

| Arquivo | Tamanho Aprox. |
|---------|----------------|
| `PsychDesk Setup 1.0.0.exe` | 150-250 MB |
| Aplicativo instalado | 300-400 MB |
| Banco de dados SQLite | 1-50 MB |

---

## ✅ Checklist Antes de Distribuir

- [ ] Testei o instalador em outra máquina
- [ ] Banco de dados está funcionando
- [ ] Login funciona (admin/admin123)
- [ ] Todas as páginas carregam
- [ ] Tema claro está aplicado
- [ ] Notificações funcionam
- [ ] Busca funciona
- [ ] Ajuda funciona

---

## 🔐 Dados do Sistema

### Login padrão:
- **Usuário:** admin
- **Senha:** admin123

### Banco de dados:
- Localizado em: `data/db/psychdesk.db`
- Tipo: SQLite (arquivo único)
- Portável: Sim (copiar o arquivo mantém os dados)

---

## 🚀 Distribuição Avançada

### Criar versão portátil (sem instalador):
```json
"build": {
  "win": {
    "target": ["nsis", "portable"]
  }
}
```

### Assinar digitalmente (opcional):
```json
"build": {
  "win": {
    "certificateFile": "certificado.pfx",
    "certificatePassword": "senha"
  }
}
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o Node.js está atualizado (v16+)
2. Rode `npm run build` antes de `build:electron`
3. Limpe a pasta `dist-electron/` e tente novamente
4. Verifique os logs em `dist-electron/builder-debug.log`
