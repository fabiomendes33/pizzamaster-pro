# 🍕 PizzaMaster Pro v2.0

### Sistema Comercial Completo para Pizzarias, Restaurantes e Negócios Alimentícios

---

```
██████╗ ██╗███████╗███████╗ █████╗ ███╗   ███╗ █████╗ ███████╗████████╗███████╗██████╗
██╔══██╗██║╚══███╔╝╚══███╔╝██╔══██╗████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██████╔╝██║  ███╔╝   ███╔╝ ███████║██╔████╔██║███████║███████╗   ██║   █████╗  ██████╔╝
██╔═══╝ ██║ ███╔╝   ███╔╝  ██╔══██║██║╚██╔╝██║██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗
██║     ██║███████╗███████╗██║  ██║██║ ╚═╝ ██║██║  ██║███████║   ██║   ███████╗██║  ██║
╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                                   PRO v2.0
```

---

## 📋 ÍNDICE

1. [Visão Geral do Sistema](#-visão-geral-do-sistema)
2. [Estrutura de Arquivos](#-estrutura-de-arquivos)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [INSTALAÇÃO NO SERVIDOR (Sua Máquina)](#-instalação-no-servidor-sua-máquina)
5. [INSTALAÇÃO NO CLIENTE (Máquina do Cliente)](#-instalação-no-cliente-máquina-do-cliente)
6. [HOSPEDAGEM NA INTERNET (Produção)](#-hospedagem-na-internet-produção)
7. [Configuração do Backend](#-configuração-do-backend)
8. [Usuários e Senhas Padrão](#-usuários-e-senhas-padrão)
9. [API REST - Endpoints](#-api-rest---endpoints)
10. [Módulos do Sistema](#-módulos-do-sistema)
11. [Personalização para Cada Cliente](#-personalização-para-cada-cliente)
12. [Solução de Problemas](#-solução-de-problemas)
13. [Suporte Técnico](#-suporte-técnico)

---

## 🎯 Visão Geral do Sistema

O **PizzaMaster Pro** é um sistema de gestão comercial completo desenvolvido para pizzarias, restaurantes, lanchonetes e qualquer negócio do setor alimentício.

### ✅ O que está incluído:

| Módulo               | Descrição                                 |
| -------------------- | ----------------------------------------- |
| 📊 Dashboard         | KPIs em tempo real, gráficos e métricas   |
| 🍕 Cardápio Digital  | Gerenciamento completo com preços P/M/G   |
| 📋 Pedidos (Kanban)  | Controle visual do fluxo de pedidos       |
| 👥 Clientes          | Cadastro completo com histórico           |
| 📦 Estoque           | Controle com alertas de reposição         |
| 💰 Financeiro        | Receitas, despesas e DRE                  |
| 📈 Relatórios        | Gerenciais completos                      |
| 🌐 Cardápio Online   | Página para cliente fazer pedido          |
| 🖨️ Impressão Comanda | 3 modelos (completa, cozinha, entregador) |
| 💬 Central WhatsApp  | Templates e comunicação com clientes      |
| ⚙️ Backend API       | Node.js + Express + PostgreSQL            |

---

## 📁 Estrutura de Arquivos

```
PizzaMaster Pro/
│
├── 📁 frontend/
│   ├── 📄 index.html              ← Sistema principal (admin)
│   ├── 🎨 style.css               ← Design system completo
│   ├── ⚡ app.js                  ← Lógica e integração com API
│   ├── 🌐 cardapio-online.html    ← Cardápio público para clientes
│   ├── 🖨️  comanda.html           ← Sistema de impressão
│   └── 💬 whatsapp.html           ← Central de comunicação
│
├── 📁 backend/
│   ├── ⚙️  server.js              ← API REST completa
│   └── 📦 package.json            ← Dependências Node.js
│
├── 📁 database/
│   └── 🗄️  schema.sql             ← Banco de dados PostgreSQL
│
└── 📖 README.md                   ← Este arquivo
```

---

## 🛠️ Tecnologias Utilizadas

| Camada         | Tecnologia                | Versão    |
| -------------- | ------------------------- | --------- |
| Frontend       | HTML5 + CSS3 + JavaScript | ES6+      |
| Gráficos       | Chart.js                  | 4.x       |
| Backend        | Node.js + Express         | 18+ / 4.x |
| Banco de Dados | PostgreSQL                | 14+       |
| Autenticação   | JWT + bcryptjs            | -         |
| Fontes         | Google Fonts              | -         |

---

# 🖥️ INSTALAÇÃO NO SERVIDOR (Sua Máquina)

> Esta seção é para você — o desenvolvedor que vai hospedar o sistema.

## PRÉ-REQUISITOS

Você precisa ter instalado na sua máquina:

- ✅ **Node.js 18+** → https://nodejs.org (baixe a versão LTS)
- ✅ **PostgreSQL 14+** → https://postgresql.org/download
- ✅ **pgAdmin 4** → vem junto com o PostgreSQL
- ✅ **VS Code** → https://code.visualstudio.com
- ✅ **Git** (opcional) → https://git-scm.com

---

## PASSO 1 — Verificar se Node.js está instalado

Abra o **CMD** ou **Terminal do VS Code** (`Ctrl + '`) e digite:

```bash
node --version
npm --version
```

Deve aparecer algo como:

```
v18.17.0
9.6.7
```

Se não aparecer, instale o Node.js no link acima.

---

## PASSO 2 — Verificar se PostgreSQL está instalado

```bash
psql --version
```

Deve aparecer:

```
psql (PostgreSQL) 18.x
```

---

## PASSO 3 — Criar o Banco de Dados no pgAdmin

1. Abra o **pgAdmin 4**
2. Digite sua senha master
3. Expanda **Servers → PostgreSQL**
4. Clique com botão direito em **Databases**
5. Clique em **Create → Database...**
6. No campo **Database** digite: `pizzamaster`
7. Clique em **Save**

---

## PASSO 4 — Executar o Schema SQL

1. Clique em `pizzamaster` para selecionar
2. Vá em **Tools → Query Tool**
3. Clique no ícone 📂 **Open File**
4. Navegue até a pasta `database/` do projeto
5. Selecione o arquivo `schema.sql`
6. Clique em **Open**
7. Pressione **F5** para executar

✅ Deve aparecer na aba Messages:

```
CREATE TRIGGER
Query returned successfully in 433 msec.
```

### Verificar tabelas criadas:

Cole no Query Tool e pressione F5:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve aparecer 10 tabelas:

```
clientes
configuracoes
estoque
itens_pedido
movimentacoes_estoque
pedidos
pizzas
usuarios
v_dashboard
v_top_pizzas
```

---

## PASSO 5 — Configurar a Senha do Banco

Abra o arquivo `backend/server.js` no VS Code.

Encontre as linhas 26 a 35 e configure:

```javascript
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "pizzamaster",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "SUA_SENHA_AQUI", // ← coloque sua senha
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

> ⚠️ **IMPORTANTE:** Substitua `SUA_SENHA_AQUI` pela senha que você definiu ao instalar o PostgreSQL.

---

## PASSO 6 — Instalar Dependências e Rodar o Backend

No terminal do VS Code:

```bash
cd backend
npm install
node server.js
```

✅ Deve aparecer:

```
🍕 PizzaMaster Pro Backend rodando na porta 3001
📡 API: http://localhost:3001/api
❤️  Health: http://localhost:3001/api/health
```

---

## PASSO 7 — Testar se está tudo funcionando

Abra o navegador e acesse:

```
http://localhost:3001/api/health
```

✅ Deve aparecer:

```json
{ "status": "ok", "timestamp": "2026-xx-xxTxx:xx:xx.xxxZ", "db": "connected" }
```

---

## PASSO 8 — Abrir o Frontend

Abra o arquivo `frontend/index.html` no navegador.

> **Dica:** Use a extensão **Live Server** do VS Code para abrir com reload automático.
> Clique com botão direito no `index.html` → **Open with Live Server**

---

# 💻 INSTALAÇÃO NO CLIENTE (Máquina do Cliente)

> Esta seção é para instalar o sistema na máquina do seu cliente (pizzaria, restaurante, etc.)

## OPÇÃO A — Cliente acessa pelo navegador (Recomendado ✅)

Neste modelo, **você hospeda o sistema no seu servidor** e o cliente acessa pelo navegador — sem instalar nada na máquina dele!

O cliente só precisa de:

- ✅ Computador, tablet ou celular
- ✅ Navegador (Chrome, Firefox, Edge)
- ✅ Conexão com internet

> Veja a seção **HOSPEDAGEM NA INTERNET** abaixo para configurar isso.

---

## OPÇÃO B — Instalação Local na Máquina do Cliente

Se o cliente não tiver internet ou preferir tudo local, instale diretamente na máquina dele.

### PRÉ-REQUISITOS na máquina do cliente:

| Software       | Download                  | Observação    |
| -------------- | ------------------------- | ------------- |
| Node.js 18+    | https://nodejs.org        | Versão LTS    |
| PostgreSQL 14+ | https://postgresql.org    | Anote a senha |
| pgAdmin 4      | Vem com PostgreSQL        | -             |
| Google Chrome  | https://chrome.google.com | Recomendado   |

---

### PASSO A PASSO NA MÁQUINA DO CLIENTE:

**1. Copiar os arquivos do projeto**

Copie a pasta completa `PizzaMaster Pro` para o computador do cliente. Pode usar:

- Pen drive USB
- Google Drive / OneDrive
- Enviar por WhatsApp (zip)

Sugere-se colocar em: `C:\PizzaMaster Pro\`

---

**2. Instalar Node.js**

- Acesse https://nodejs.org
- Baixe a versão **LTS** (recomendada)
- Execute o instalador `.msi`
- Clique em **Next** em tudo
- Reinicie o computador após instalar

Verificar: abra o CMD e digite `node --version`

---

**3. Instalar PostgreSQL**

- Acesse https://postgresql.org/download/windows
- Baixe o instalador para Windows
- Execute e siga os passos:
  - Porta: **5432** (deixe padrão)
  - Senha: anote bem! (ex: `pizzamaster2026`)
  - Locale: **Portuguese, Brazil**
- Finalize a instalação

---

**4. Criar o banco de dados**

Abra o **pgAdmin 4** (instalado junto com PostgreSQL):

- Digite a senha master (mesma do PostgreSQL)
- Clique direito em **Databases → Create → Database**
- Nome: `pizzamaster`
- Clique **Save**

---

**5. Executar o schema.sql**

- Selecione o banco `pizzamaster`
- Vá em **Tools → Query Tool**
- Clique no ícone 📂 e abra o arquivo `database/schema.sql`
- Pressione **F5**

---

**6. Configurar a senha no server.js**

Abra `backend/server.js` e edite a linha da senha:

```javascript
password: process.env.DB_PASS || "SENHA_QUE_O_CLIENTE_DEFINIU",
```

---

**7. Criar atalho para iniciar o sistema**

Crie um arquivo chamado `INICIAR.bat` na raiz do projeto com o conteúdo:

```bat
@echo off
title PizzaMaster Pro - Servidor
color 0A
echo.
echo  ================================================
echo   🍕 PIZZAMASTER PRO - Iniciando Sistema...
echo  ================================================
echo.
cd /d "%~dp0backend"
echo  ✅ Iniciando Backend...
start "PizzaMaster Backend" cmd /k "node server.js"
timeout /t 3 /nobreak > nul
echo  ✅ Abrindo Sistema no Navegador...
start chrome "http://localhost:5500/frontend/index.html"
echo.
echo  Sistema iniciado com sucesso!
echo  Pressione qualquer tecla para fechar esta janela...
pause > nul
```

> Agora o cliente só precisa dar **duplo clique** no `INICIAR.bat` para abrir o sistema!

---

**8. Criar atalho na área de trabalho**

- Clique direito no `INICIAR.bat`
- Clique em **Criar atalho**
- Arraste o atalho para a **Área de Trabalho**
- Renomeie para `🍕 PizzaMaster Pro`

---

# 🌐 HOSPEDAGEM NA INTERNET (Produção)

> Para que o cliente acesse o sistema de qualquer lugar, pelo celular ou computador.

## OPÇÃO 1 — VPS (Recomendado para revenda)

### Provedores recomendados:

| Provedor     | Plano         | Preço/mês | Link             |
| ------------ | ------------- | --------- | ---------------- |
| Hostinger    | KVM 2         | R$ 29,99  | hostinger.com.br |
| DigitalOcean | Droplet Basic | US$ 6     | digitalocean.com |
| Contabo      | VPS S         | € 4,99    | contabo.com      |
| Vultr        | Regular       | US$ 6     | vultr.com        |

### Configuração mínima do servidor:

- 2 GB RAM
- 1 vCPU
- 50 GB SSD
- Ubuntu 22.04 LTS

---

### PASSO A PASSO — VPS Ubuntu:

**1. Conectar no servidor via SSH:**

```bash
ssh root@IP_DO_SERVIDOR
```

**2. Atualizar o sistema:**

```bash
apt update && apt upgrade -y
```

**3. Instalar Node.js 18:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node --version
```

**4. Instalar PostgreSQL:**

```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

**5. Configurar banco de dados:**

```bash
sudo -u postgres psql
```

Dentro do PostgreSQL, execute:

```sql
CREATE DATABASE pizzamaster;
CREATE USER pizzauser WITH ENCRYPTED PASSWORD 'SuaSenhaForte2026!';
GRANT ALL PRIVILEGES ON DATABASE pizzamaster TO pizzauser;
\q
```

**6. Enviar os arquivos para o servidor:**

No seu computador (Windows), use o **WinSCP** (https://winscp.net) para enviar a pasta do projeto para `/var/www/pizzamaster/`

**7. Executar o schema:**

```bash
cd /var/www/pizzamaster
psql -U pizzauser -d pizzamaster -f database/schema.sql
```

**8. Instalar dependências:**

```bash
cd /var/www/pizzamaster/backend
npm install
```

**9. Instalar PM2 (manter servidor rodando 24/7):**

```bash
npm install -g pm2
pm2 start server.js --name "pizzamaster"
pm2 startup
pm2 save
```

**10. Instalar Nginx (proxy reverso):**

```bash
apt install -y nginx
```

Crie o arquivo de configuração:

```bash
nano /etc/nginx/sites-available/pizzamaster
```

Cole o conteúdo:

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com.br;

    # Frontend
    location / {
        root /var/www/pizzamaster/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site:

```bash
ln -s /etc/nginx/sites-available/pizzamaster /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**11. Instalar SSL (HTTPS gratuito):**

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d SEU_DOMINIO.com.br
```

✅ Pronto! O sistema estará acessível em `https://SEU_DOMINIO.com.br`

---

## OPÇÃO 2 — Domínio para cada cliente

Para cada cliente ter seu próprio endereço:

| Cliente          | Domínio               | Custo     |
| ---------------- | --------------------- | --------- |
| Pizzaria do João | pizzariadojoao.com.br | R$ 40/ano |
| Burger House     | burgerhouse.com.br    | R$ 40/ano |

Registre domínios em: **https://registro.br**

---

# ⚙️ Configuração do Backend

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
# ── BANCO DE DADOS ──────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pizzamaster
DB_USER=postgres
DB_PASS=sua_senha_aqui

# ── SERVIDOR ────────────────────────────────
PORT=3001
NODE_ENV=production

# ── SEGURANÇA ───────────────────────────────
JWT_SECRET=pizzamaster_chave_secreta_muito_longa_2026

# ── WHATSAPP (opcional) ─────────────────────
WHATSAPP_NUMBER=5511999999999
```

> ⚠️ **NUNCA compartilhe o arquivo `.env`** — ele contém senhas!

---

## Iniciar o servidor:

```bash
# Desenvolvimento
node server.js

# Produção (com PM2)
pm2 start server.js --name "pizzamaster"

# Ver logs
pm2 logs pizzamaster

# Reiniciar
pm2 restart pizzamaster

# Parar
pm2 stop pizzamaster
```

---

# 🔐 Usuários e Senhas Padrão

> ⚠️ **TROQUE AS SENHAS** após a primeira instalação!

| Email                     | Senha Padrão | Perfil        | Permissões         |
| ------------------------- | ------------ | ------------- | ------------------ |
| admin@pizzamaster.com     | admin123     | Administrador | Acesso total       |
| gerente@pizzamaster.com   | admin123     | Gerente       | Sem configurações  |
| atendente@pizzamaster.com | admin123     | Atendente     | Pedidos e clientes |

### Como trocar a senha via pgAdmin:

```sql
-- Gerar novo hash (use bcrypt online: https://bcrypt-generator.com)
UPDATE usuarios
SET senha_hash = '$2a$10$NOVO_HASH_AQUI'
WHERE email = 'admin@pizzamaster.com';
```

---

# 📡 API REST — Endpoints

## Base URL

```
http://localhost:3001/api
```

## Autenticação

Todas as rotas protegidas precisam do header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

## Endpoints Disponíveis

### 🔑 Auth

```
POST   /api/auth/login              Login no sistema
POST   /api/auth/register           Cadastrar usuário
```

### 🍕 Pizzas

```
GET    /api/pizzas                  Listar todas as pizzas
GET    /api/pizzas?categoria=especial   Filtrar por categoria
GET    /api/pizzas/:id              Detalhes de uma pizza
POST   /api/pizzas                  Criar nova pizza 🔒
PUT    /api/pizzas/:id              Editar pizza 🔒
DELETE /api/pizzas/:id              Desativar pizza 🔒
```

### 👥 Clientes

```
GET    /api/clientes                Listar clientes 🔒
GET    /api/clientes?search=nome    Buscar clientes 🔒
GET    /api/clientes/:id            Detalhes + histórico 🔒
POST   /api/clientes                Cadastrar cliente 🔒
PUT    /api/clientes/:id            Editar cliente 🔒
DELETE /api/clientes/:id            Desativar cliente 🔒
```

### 📋 Pedidos

```
GET    /api/pedidos                 Listar pedidos 🔒
GET    /api/pedidos?status=recebido Filtrar por status 🔒
GET    /api/pedidos/:id             Detalhes do pedido 🔒
POST   /api/pedidos                 Criar pedido 🔒
PATCH  /api/pedidos/:id/status      Atualizar status 🔒
```

### 📦 Estoque

```
GET    /api/estoque                 Listar estoque 🔒
POST   /api/estoque                 Adicionar item 🔒
PATCH  /api/estoque/:id/repor       Repor quantidade 🔒
```

### 📊 Dashboard

```
GET    /api/dashboard               KPIs em tempo real 🔒
GET    /api/relatorios/vendas       Relatório de vendas 🔒
GET    /api/health                  Status do servidor ✅
```

> 🔒 = Requer autenticação JWT

---

# 🎨 Módulos do Sistema

## 1. 📊 Dashboard

- KPIs animados (pedidos, faturamento, clientes, tempo)
- Gráfico de vendas semanal
- Top 6 pizzas mais vendidas
- Feed de pedidos em tempo real

## 2. 🍕 Cardápio Digital

- Grid de pizzas com emojis
- Filtros por categoria
- Preços P, M e G
- Adicionar, editar e remover pizzas

## 3. 📋 Pedidos Kanban

- 4 colunas: Recebido → Preparando → Entrega → Entregue
- Arrastar e avançar pedidos
- Novo pedido com carrinho

## 4. 👥 Clientes

- Tabela completa com busca
- Total gasto e número de pedidos
- Botão de WhatsApp direto

## 5. 📦 Estoque

- Alertas visuais: ✅ OK / ⚠️ Baixo / ⛔ Esgotado
- Reposição rápida

## 6. 💰 Financeiro

- Receita, despesas e lucro
- Tabela de transações
- DRE simplificado

## 7. 📈 Relatórios

- Vendas por período
- Top clientes
- Ranking de pizzas
- DRE completo

## 8. 🌐 Cardápio Online (`cardapio-online.html`)

- Página pública para clientes
- Carrinho completo
- Entrega ou retirada
- Pedido direto pelo WhatsApp

## 9. 🖨️ Impressão de Comanda (`comanda.html`)

- Modelo Completo (cliente)
- Modelo Cozinha
- Modelo Entregador
- Impressão otimizada para térmica 80mm

## 10. 💬 Central WhatsApp (`whatsapp.html`)

- Interface estilo WhatsApp Web
- 9 templates prontos
- Ações rápidas por status do pedido
- Estatísticas de mensagens

---

# 🎨 Personalização para Cada Cliente

## Trocar Nome e Cores (5 minutos)

### 1. Nome da pizzaria — `frontend/index.html`

Linha ~20:

```html
<h2>PizzaMaster</h2>
← trocar pelo nome do cliente <small>Sistema Pro</small> ← slogan opcional
```

### 2. Cor principal — `frontend/style.css`

Linhas 1-10:

```css
:root {
  --primary: #FF4500;      ← cor principal (laranja padrão)
  --primary-dark: #CC3700; ← cor mais escura
  --primary-light: #FF6B35;← cor mais clara
  --accent: #FFD700;       ← cor de destaque (amarelo padrão)
}
```

Exemplos de cores por segmento:

```css
/* Pizzaria clássica */
--primary: #ff4500;
/* Hamburgueria */
--primary: #8b4513;
/* Sushi/Japonês */
--primary: #dc143c;
/* Açaí/Natural */
--primary: #228b22;
/* Cafeteria */
--primary: #6f4e37;
/* Sorvetes */
--primary: #ff69b4;
```

### 3. Número do WhatsApp — `frontend/cardapio-online.html`

Linha ~130:

```javascript
const WHATSAPP = "5511999999999"; // ← número do cliente (com DDI 55)
```

### 4. Dados da empresa — pgAdmin

```sql
UPDATE configuracoes SET valor = 'Pizzaria do João' WHERE chave = 'nome_empresa';
UPDATE configuracoes SET valor = '(11) 9999-9999' WHERE chave = 'telefone';
UPDATE configuracoes SET valor = 'Rua das Pizzas, 123' WHERE chave = 'endereco';
UPDATE configuracoes SET valor = '5511999999999' WHERE chave = 'whatsapp';
```

### 5. Cardápio — via interface ou SQL

```sql
-- Trocar todas as pizzas do cardápio padrão
DELETE FROM pizzas WHERE 1=1;

-- Inserir cardápio personalizado
INSERT INTO pizzas (nome, categoria, ingredientes, preco_p, preco_m, preco_g, emoji)
VALUES ('Pizza do João', 'especial', 'Ingredientes...', 35.90, 45.90, 59.90, '🍕');
```

---

# 🔧 Solução de Problemas

## ❌ "Cannot connect to database"

**Causa:** Senha do PostgreSQL incorreta

**Solução:** Verifique a senha no `server.js`:

```javascript
password: "SUA_SENHA_CORRETA",
```

---

## ❌ "Port 3001 is already in use"

**Causa:** O servidor já está rodando em outra janela

**Solução no Windows:**

```bash
netstat -ano | findstr :3001
taskkill /PID NUMERO_DO_PID /F
```

Ou simplesmente feche o terminal anterior e abra um novo.

---

## ❌ "npm: command not found"

**Causa:** Node.js não está instalado ou não está no PATH

**Solução:** Reinstale o Node.js em https://nodejs.org e reinicie o computador

---

## ❌ Página em branco no navegador

**Causa:** Caminho do arquivo incorreto

**Solução:** Certifique-se de abrir o arquivo via Live Server ou pelo caminho correto:

```
http://127.0.0.1:5500/frontend/index.html
```

---

## ❌ "Module not found" ao rodar server.js

**Causa:** Dependências não instaladas

**Solução:**

```bash
cd backend
rm -rf node_modules
npm install
node server.js
```

---

## ❌ Emojis não aparecem nas pizzas

**Causa:** Fonte do sistema não suporta emojis coloridos

**Solução:** Troque o emoji por um que funcione no sistema, ou substitua por texto:

```javascript
emoji: "🍕"; // tente outros: 🫓 🧀 🌶️ 🐔
```

---

## ❌ pgAdmin não abre / senha master esquecida

**Solução:** Resetar senha master do pgAdmin:

1. Abra o Regedit (`Win + R` → `regedit`)
2. Navegue até: `HKEY_CURRENT_USER\Software\pgadmin.org`
3. Delete a pasta `pgAdmin 4`
4. Reabra o pgAdmin e defina uma nova senha

---

# 💰 Modelo de Negócio — Como Vender

## Precificação sugerida:

| Serviço                            | Valor               |
| ---------------------------------- | ------------------- |
| Instalação + Configuração          | R$ 1.500 – R$ 3.000 |
| Personalização completa            | R$ 500 – R$ 1.000   |
| Treinamento (2h)                   | R$ 300 – R$ 500     |
| Mensalidade (suporte + hospedagem) | R$ 150 – R$ 300/mês |
| Hospedagem VPS por cliente         | R$ 30 – R$ 50/mês   |

## Projeção com 10 clientes:

```
Instalações:  10 × R$ 2.000 = R$ 20.000 (entrada)
Mensalidades: 10 × R$ 200   = R$ 2.000/mês (recorrente)
```

---

# 📞 Suporte Técnico

## Informações do Sistema

| Item            | Detalhe                |
| --------------- | ---------------------- |
| Versão          | PizzaMaster Pro v2.0   |
| Desenvolvido em | Fevereiro/2026         |
| Backend         | Node.js 18 + Express 4 |
| Banco           | PostgreSQL 14+         |
| Frontend        | HTML5 + CSS3 + JS ES6+ |
| Licença         | Proprietária           |

## Checklist de Entrega ao Cliente

- [ ] Sistema instalado e funcionando
- [ ] Banco de dados criado com dados iniciais
- [ ] Cardápio personalizado com as pizzas do cliente
- [ ] Logo e cores configuradas
- [ ] Número do WhatsApp configurado
- [ ] Senha do admin trocada
- [ ] Atalho criado na área de trabalho
- [ ] Treinamento realizado
- [ ] Manual entregue ao cliente
- [ ] Backup inicial realizado

---

## Comandos Úteis de Manutenção

```bash
# Backup do banco de dados
pg_dump -U postgres pizzamaster > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres -d pizzamaster < backup_20260225.sql

# Ver logs do servidor (PM2)
pm2 logs pizzamaster

# Reiniciar servidor após atualização
pm2 restart pizzamaster

# Ver status dos processos
pm2 status
```
https://github.com/fabiomendes33/pizzamaster-pro

---

_🍕 PizzaMaster Pro v2.0 — Sistema Comercial Completo_
_Desenvolvido com ❤️ para o mercado brasileiro_
