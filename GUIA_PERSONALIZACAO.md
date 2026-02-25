# 🎨 GUIA DE PERSONALIZAÇÃO — PizzaMaster Pro v2.0
### Como personalizar o sistema para cada cliente

---

## 📋 ÍNDICE

1. [Trocar Nome e Logo](#1--trocar-nome-e-logo)
2. [Trocar Cores do Sistema](#2--trocar-cores-do-sistema)
3. [Editar Pizzas e Preços](#3--editar-pizzas-e-preços)
4. [Adicionar Nova Pizza](#4--adicionar-nova-pizza)
5. [Remover Pizza do Cardápio](#5--remover-pizza-do-cardápio)
6. [Trocar Emoji das Pizzas](#6--trocar-emoji-das-pizzas)
7. [Configurar WhatsApp](#7--configurar-whatsapp)
8. [Trocar Logotipo](#8--trocar-logotipo)
9. [Personalizar Cardápio Online](#9--personalizar-cardápio-online)
10. [Checklist Final](#10--checklist-final)

---

## 1. 🏪 Trocar Nome e Logo

### No arquivo: `frontend/index.html`

Procure por (aproximadamente linha 30):

```html
<!-- ANTES -->
<h2>PizzaMaster</h2>
<small>Sistema Pro</small>

<!-- DEPOIS — troque pelo nome do cliente -->
<h2>Pizzaria do João</h2>
<small>O melhor sabor da cidade</small>
```

### No arquivo: `frontend/cardapio-online.html`

Procure por (aproximadamente linha 165):

```html
<!-- ANTES -->
<div class="hero-text">
  <h1>PizzaMaster Pro</h1>
  <p>Delivery & Retirada • Qualidade garantida</p>
</div>

<!-- DEPOIS -->
<div class="hero-text">
  <h1>Pizzaria do João</h1>
  <p>A melhor pizza da cidade! Delivery e Retirada</p>
</div>
```

### No arquivo: `frontend/comanda.html`

Procure por:

```javascript
// ANTES
const EMPRESA = {
  nome: 'PizzaMaster Pro',
  cnpj: '00.000.000/0001-00',
  end: 'Rua das Pizzas, 123 — São Paulo/SP',
  tel: '(11) 9999-9999',
  whatsapp: '(11) 99999-9999',
};

// DEPOIS — dados reais do cliente
const EMPRESA = {
  nome: 'Pizzaria do João',
  cnpj: '12.345.678/0001-99',
  end: 'Rua das Flores, 500 — Centro, São Paulo/SP',
  tel: '(11) 3333-3333',
  whatsapp: '(11) 99999-9999',
};
```

---

## 2. 🎨 Trocar Cores do Sistema

### No arquivo: `frontend/style.css` (linha 1 até 20)

```css
:root {
  /* ── COR PRINCIPAL (botões, destaques, sidebar ativo) ── */
  --primary: #FF4500;       /* ← TROQUE AQUI */
  --primary-dark: #CC3700;  /* ← versão mais escura (hover) */
  --primary-light: #FF6B35; /* ← versão mais clara */
  
  /* ── COR DE DESTAQUE (preços, valores) ── */
  --accent: #FFD700;        /* ← TROQUE AQUI */
}
```

### 🎨 Paletas prontas por segmento:

#### 🍕 Pizzaria Tradicional (laranja/vermelho)
```css
--primary: #FF4500;
--primary-dark: #CC3700;
--primary-light: #FF6B35;
--accent: #FFD700;
```

#### 🍔 Hamburgueria (marrom/âmbar)
```css
--primary: #C0392B;
--primary-dark: #96281B;
--primary-light: #E74C3C;
--accent: #F39C12;
```

#### 🌿 Restaurante Natural/Vegano (verde)
```css
--primary: #27AE60;
--primary-dark: #1E8449;
--primary-light: #2ECC71;
--accent: #F1C40F;
```

#### ☕ Cafeteria (marrom café)
```css
--primary: #6F4E37;
--primary-dark: #5D4037;
--primary-light: #8D6E63;
--accent: #FFC107;
```

#### 🍣 Japonês/Sushi (vermelho escuro)
```css
--primary: #C0392B;
--primary-dark: #922B21;
--primary-light: #E74C3C;
--accent: #ECF0F1;
```

#### 🍦 Sorveteria (rosa/lilás)
```css
--primary: #E91E63;
--primary-dark: #C2185B;
--primary-light: #F06292;
--accent: #CE93D8;
```

#### 🛒 Mercadinho/Loja (azul)
```css
--primary: #1565C0;
--primary-dark: #0D47A1;
--primary-light: #1976D2;
--accent: #FFC107;
```

---

## 3. ✏️ Editar Pizzas e Preços

### Opção A — Direto no arquivo `frontend/app.js`

Procure por `DEFAULT_PIZZAS` (linha ~15) e edite:

```javascript
const DEFAULT_PIZZAS = [
  { 
    id: 1, 
    nome: 'Margherita',           // ← Nome da pizza
    emoji: '🍕',                  // ← Emoji/ícone
    categoria: 'tradicional',     // ← tradicional | especial | premium | doce | bebida
    ingredientes: 'Tomate, mussarela, manjericão fresco',  // ← Ingredientes
    preco_p: 29.90,               // ← Preço Pequena (25cm)
    preco_m: 39.90,               // ← Preço Média (30cm)
    preco_g: 49.90,               // ← Preço Grande (35cm)
    vendas: 142                   // ← Número de vendas (para ranking)
  },
  // ... mais pizzas
];
```

### Opção B — Direto no banco PostgreSQL (pgAdmin)

Abra o **Query Tool** no pgAdmin e execute:

```sql
-- VER todas as pizzas e preços atuais
SELECT id, nome, preco_p, preco_m, preco_g, categoria 
FROM pizzas 
ORDER BY categoria, nome;

-- ATUALIZAR preço de uma pizza específica
UPDATE pizzas 
SET preco_p = 32.90, preco_m = 44.90, preco_g = 58.90
WHERE nome = 'Margherita';

-- ATUALIZAR nome e ingredientes
UPDATE pizzas 
SET nome = 'Margherita Especial',
    ingredientes = 'Tomate San Marzano, mussarela de búfala, manjericão'
WHERE id = 1;

-- ATUALIZAR todos os preços de uma categoria (ex: aumento de 10%)
UPDATE pizzas 
SET preco_p = ROUND(preco_p * 1.10, 2),
    preco_m = ROUND(preco_m * 1.10, 2),
    preco_g = ROUND(preco_g * 1.10, 2)
WHERE categoria = 'tradicional';
```

---

## 4. ➕ Adicionar Nova Pizza

### No arquivo `frontend/app.js`

Dentro do array `DEFAULT_PIZZAS`, adicione:

```javascript
{
  id: 13,                          // ← número único (sempre maior que o último)
  nome: 'Carne Seca com Abóbora',  // ← nome da pizza
  emoji: '🥩',                     // ← emoji
  categoria: 'especial',           // ← categoria
  ingredientes: 'Carne seca desfiada, abóbora, cream cheese, mussarela',
  preco_p: 38.90,
  preco_m: 50.90,
  preco_g: 65.90,
  vendas: 0
},
```

### No banco PostgreSQL (pgAdmin):

```sql
INSERT INTO pizzas (nome, categoria, ingredientes, descricao, preco_p, preco_m, preco_g, emoji, ativo)
VALUES (
  'Carne Seca com Abóbora',
  'especial',
  'Carne seca desfiada, abóbora, cream cheese, mussarela',
  'Combinação perfeita do nordestino com o cremoso',
  38.90,
  50.90,
  65.90,
  '🥩',
  true
);
```

---

## 5. 🗑️ Remover Pizza do Cardápio

### No arquivo `frontend/app.js`

Simplesmente **apague** o objeto da pizza que não quer, ou mude a categoria:

```javascript
// Para esconder sem apagar, mude categoria para 'inativo'
{ id: 9, nome: 'Mexicana', categoria: 'inativo', ... }
```

### No banco PostgreSQL:

```sql
-- DESATIVAR (recomendado — não apaga os dados históricos)
UPDATE pizzas SET ativo = false WHERE nome = 'Mexicana';

-- REATIVAR
UPDATE pizzas SET ativo = true WHERE nome = 'Mexicana';

-- APAGAR permanentemente (cuidado! não tem volta)
DELETE FROM pizzas WHERE nome = 'Mexicana';
```

---

## 6. 😀 Trocar Emoji das Pizzas

Use emojis que representem bem o sabor. Copie e cole diretamente:

| Emoji | Uso sugerido |
|-------|-------------|
| 🍕 | Pizzas em geral |
| 🧀 | Quatro queijos, queijos especiais |
| 🍅 | Margherita, napolitana, tomate |
| 🌶️ | Calabresa, picante, mexicana |
| 🐔 | Frango, catupiry |
| 🥩 | Carne, strogonoff, churrasco |
| 🫒 | Portuguesa, azeitona |
| 🍌 | Banana nevada |
| 🍓 | Nutella morango, frutas |
| 🫚 | Trufa, premium |
| 🍫 | Chocolate, doces |
| 🥦 | Vegetariana, vegana |
| 🍤 | Frutos do mar, camarão |
| 🥚 | Ovo, portuguesa |
| 🌿 | Ervas, manjericão |
| 🥤 | Refrigerante, bebidas |
| 🍊 | Suco natural |
| 💧 | Água mineral |
| 🍺 | Cerveja |

---

## 7. 💬 Configurar WhatsApp

### No arquivo `frontend/cardapio-online.html`

Procure por `const WHATSAPP` (linha ~130):

```javascript
// ANTES
const WHATSAPP = '5511999999999';

// DEPOIS — número real do cliente
// Formato: 55 (Brasil) + DDD + número
// Exemplo: (11) 98765-4321 → 5511987654321
const WHATSAPP = '5511987654321';
```

> ⚠️ **Importante:**
> - Sempre começa com `55` (código do Brasil)
> - Sem espaços, traços ou parênteses
> - Exemplo: `(47) 99999-8888` → `5547999998888`

### No arquivo `frontend/whatsapp.html`

Procure por `const NUMERO_LOJA` (linha ~10):

```javascript
const NUMERO_LOJA = '5511987654321'; // ← mesmo número
```

---

## 8. 🖼️ Trocar Logotipo

O sistema usa um emoji 🍕 como logo. Para trocar por uma imagem real:

### Opção A — Trocar o emoji por imagem (fácil)

No arquivo `frontend/index.html`, procure:

```html
<!-- ANTES -->
<span class="logo-icon">🍕</span>

<!-- DEPOIS — com imagem -->
<img src="logo.png" alt="Logo" style="width:45px;height:45px;object-fit:contain;">
```

> Coloque o arquivo `logo.png` dentro da pasta `frontend/`

### Opção B — Logo em formato SVG (melhor qualidade)

```html
<img src="logo.svg" alt="Logo" style="width:45px;height:45px;">
```

### Formatos de logo aceitos:
- ✅ PNG (fundo transparente recomendado)
- ✅ SVG (melhor qualidade em qualquer tamanho)
- ✅ JPG (menos recomendado — sem transparência)

### Tamanho ideal do logo:
- **Mínimo:** 100x100 pixels
- **Recomendado:** 200x200 pixels
- **Formato:** Quadrado ou circular

> 💡 **Dica:** Use o site https://remove.bg para remover o fundo da logo do cliente gratuitamente.

---

## 9. 🌐 Personalizar Cardápio Online

O arquivo `frontend/cardapio-online.html` é a página pública que o cliente final vê.

### Informações para trocar:

```html
<!-- Linha ~170 — Status e horário -->
<div class="status-badge">
  <span class="status-dot"></span> ABERTO AGORA  ← pode trocar
</div>
<div class="hero-hours">
  🕐 Horário: <strong>17:00 – 23:30</strong>  ← horário real
  | <strong>📍 São Paulo, SP</strong>           ← cidade real
</div>
```

```html
<!-- Linha ~185 — Barra de informações -->
<div class="db-item">🛵 Entrega: <strong>R$ 5,00</strong></div>      ← taxa real
<div class="db-item">⏱️ Tempo médio: <strong>40–55 min</strong></div> ← tempo real
<div class="db-item">📦 Pedido mínimo: <strong>R$ 30,00</strong></div>← mínimo real
<div class="db-item">⭐ <strong>4.9</strong> (1.240 avaliações)</div> ← avalição real
```

### Também no `cardapio-online.html` — lista de pizzas:

Procure por `const PIZZAS = [` e edite da mesma forma que o `app.js`.

---

## 10. ✅ Checklist Final de Personalização

Antes de entregar o sistema ao cliente, confirme:

### Dados da Empresa
- [ ] Nome da pizzaria trocado em `index.html`
- [ ] Nome trocado em `cardapio-online.html`
- [ ] Dados trocados em `comanda.html` (CNPJ, endereço, telefone)
- [ ] Logo inserida (se tiver)

### Cores
- [ ] Cor principal (`--primary`) trocada em `style.css`
- [ ] Cor de destaque (`--accent`) trocada em `style.css`

### Cardápio
- [ ] Pizzas antigas removidas ou desativadas
- [ ] Pizzas reais do cliente adicionadas
- [ ] Preços corretos (P, M e G)
- [ ] Categorias corretas
- [ ] Emojis representativos

### WhatsApp
- [ ] Número trocado em `cardapio-online.html`
- [ ] Número trocado em `whatsapp.html`

### Cardápio Online
- [ ] Horário de funcionamento correto
- [ ] Taxa de entrega correta
- [ ] Tempo médio de entrega correto
- [ ] Pedido mínimo correto
- [ ] Cidade correta

### Banco de Dados
- [ ] Pizzas atualizadas no banco
- [ ] Configurações atualizadas (`UPDATE configuracoes...`)
- [ ] Senha do admin trocada

### Teste Final
- [ ] Abrir o sistema e navegar por todos os módulos
- [ ] Fazer um pedido de teste no cardápio online
- [ ] Testar o botão do WhatsApp
- [ ] Testar a impressão de comanda
- [ ] Verificar se todos os preços estão corretos

---

*🍕 PizzaMaster Pro v2.0 — Guia de Personalização*
*Qualquer dúvida entre em contato com o desenvolvedor*
