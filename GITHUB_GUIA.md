# 🐙 GUIA — Como Subir no GitHub com Proteção de Código

---

## ⚠️ LEIA ANTES DE CONTINUAR

Existem **2 tipos de repositório** no GitHub:

| Tipo | Quem vê | Quem pode copiar | Uso |
|------|---------|-----------------|-----|
| **Público** | Todo mundo | Todo mundo (sem proteção real) | Portfólio |
| **Privado** | Só você | Só quem você permitir | Código protegido |

> ⚠️ **IMPORTANTE:** No GitHub, código público pode ser copiado por qualquer pessoa, 
> mesmo com licença restritiva. Se quiser proteção REAL, use repositório **PRIVADO**.
> 
> A licença serve como proteção **legal** — não técnica.

---

## OPÇÃO RECOMENDADA: Repositório Privado 🔒

Ninguém vê o código. Só você e quem você convidar.
Use para guardar o código com segurança.

## OPÇÃO PORTFÓLIO: Repositório Público com Licença ⚖️

Qualquer um pode ver, mas a licença proíbe copiar/usar sem permissão.
Use para mostrar o sistema para clientes potenciais.

---

# 🚀 PASSO A PASSO — SUBIR NO GITHUB

## PASSO 1 — Criar conta no GitHub (se não tiver)

1. Acesse https://github.com
2. Clique em **Sign up**
3. Preencha email, senha e username
4. Confirme o email

---

## PASSO 2 — Instalar o Git no Windows

1. Acesse https://git-scm.com/download/win
2. Baixe e instale o **Git for Windows**
3. Durante a instalação, deixe tudo padrão
4. Reinicie o VS Code após instalar

### Verificar instalação:
```bash
git --version
```
Deve aparecer: `git version 2.x.x`

---

## PASSO 3 — Configurar o Git com seus dados

No terminal do VS Code (`Ctrl + '`):

```bash
git config --global user.name "Seu Nome Aqui"
git config --global user.email "seu-email@email.com"
```

---

## PASSO 4 — Criar o arquivo .gitignore

Na raiz do projeto, crie um arquivo chamado `.gitignore`:

```
# Dependências Node.js (não sobe para o GitHub)
node_modules/
npm-debug.log*

# Variáveis de ambiente (NUNCA suba senhas!)
.env
.env.local
.env.production

# Arquivos do sistema
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
logs/

# VS Code
.vscode/settings.json
```

> ⚠️ **MUITO IMPORTANTE:** O arquivo `.env` com suas senhas NUNCA deve ir para o GitHub!

---

## PASSO 5 — Criar o Repositório no GitHub

1. Acesse https://github.com
2. Clique no botão **"+"** no canto superior direito
3. Clique em **"New repository"**
4. Preencha:
   - **Repository name:** `pizzamaster-pro`
   - **Description:** `Sistema Comercial Completo para Pizzarias`
   - Escolha: 
     - 🔒 **Private** → só você vê (recomendado para proteger)
     - 🌐 **Public** → todos veem (para portfólio)
   - **NÃO** marque "Initialize this repository"
5. Clique em **"Create repository"**

---

## PASSO 6 — Conectar o projeto ao GitHub

No terminal do VS Code, navegue até a pasta raiz do projeto:

```bash
cd "C:\Users\benic\Desktop\PizzaMaster Pro"
```

Execute os comandos um por um:

```bash
# 1. Iniciar o repositório Git
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer o primeiro commit
git commit -m "🍕 PizzaMaster Pro v2.0 - Sistema Comercial Completo"

# 4. Definir a branch principal como 'main'
git branch -M main

# 5. Conectar com o GitHub (substitua SEU-USUARIO pelo seu username)
git remote add origin https://github.com/SEU-USUARIO/pizzamaster-pro.git

# 6. Enviar para o GitHub
git push -u origin main
```

> O GitHub vai pedir seu **usuário e senha** (ou token).
> 
> Se pedir token: vá em GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token

---

## PASSO 7 — Verificar no GitHub

Acesse: `https://github.com/SEU-USUARIO/pizzamaster-pro`

Deve aparecer todos os seus arquivos! ✅

---

## PASSO 8 — Atualizar o GitHub após mudanças

Toda vez que fizer alterações no projeto:

```bash
# Adicionar alterações
git add .

# Descrever o que mudou
git commit -m "Descrição do que foi alterado"

# Enviar para o GitHub
git push
```

---

# 🔒 COMO PROTEGER SEU CÓDIGO NO GITHUB

## Se escolheu Repositório PRIVADO:

✅ Ninguém vê o código
✅ Ninguém pode copiar
✅ Você controla quem tem acesso

Para convidar alguém específico (ex: um colaborador):
1. Vá no repositório → **Settings**
2. Clique em **Collaborators**
3. Clique em **Add people**
4. Digite o username da pessoa

---

## Se escolheu Repositório PÚBLICO (portfólio):

### Adicionar a licença de proteção:

1. Pegue o arquivo `LICENSE.md` que está na pasta do projeto
2. Ele já está configurado proibindo cópia e uso sem permissão
3. Ele foi enviado junto com os outros arquivos no `git push`

### Adicionar aviso no README:

No topo do `README.md`, adicione:

```markdown
> ⚠️ **LICENÇA PROPRIETÁRIA** — Este código é propriedade exclusiva do autor.
> É proibido copiar, distribuir ou usar sem autorização prévia por escrito.
> Veja o arquivo [LICENSE.md](LICENSE.md) para os termos completos.
```

---

## Configurar o GitHub para mostrar a licença:

1. No repositório, clique em **Add file → Create new file**
2. Nome do arquivo: `LICENSE`
3. Clique em **Choose a license template**
4. Escolha **"Other"** e cole o conteúdo do seu `LICENSE.md`
5. Commit o arquivo

---

# 📊 Como fica o repositório no GitHub

```
📁 pizzamaster-pro/
│
├── 📁 backend/
│   ├── JS server.js
│   └── {} package.json
│        (node_modules NÃO sobe - está no .gitignore)
│        (.env NÃO sobe - está no .gitignore)
│
├── 📁 database/
│   └── 🗄️ schema.sql
│
├── 📁 frontend/
│   ├── 📄 index.html
│   ├── 🎨 style.css
│   ├── ⚡ app.js
│   ├── 🌐 cardapio-online.html
│   ├── 🖨️ comanda.html
│   └── 💬 whatsapp.html
│
├── 📄 .gitignore
├── ⚖️ LICENSE.md
├── 📖 README.md
└── 🎨 GUIA_PERSONALIZACAO.md
```

---

# 🔄 Comandos Git mais usados

```bash
# Ver status dos arquivos
git status

# Ver histórico de commits
git log --oneline

# Baixar atualizações do GitHub
git pull

# Ver repositórios conectados
git remote -v

# Desfazer alterações não commitadas
git checkout -- .

# Criar nova branch (para testar algo)
git checkout -b nova-funcionalidade

# Voltar para a branch principal
git checkout main
```

---

# ❓ Problemas Comuns

## "git: command not found"
→ Git não instalado. Instale em https://git-scm.com

## "remote: Repository not found"
→ URL do repositório errada. Verifique o link no GitHub.

## "Permission denied"
→ Precisa configurar o token de acesso pessoal no GitHub.
→ GitHub → Settings → Developer Settings → Personal Access Tokens

## "error: failed to push some refs"
→ Execute primeiro: `git pull origin main --rebase`
→ Depois: `git push`

---

*🐙 GitHub configurado com proteção de licença proprietária*
*🍕 PizzaMaster Pro v2.0*
