/**
 * PIZZAMASTER PRO — BACKEND
 * Node.js + Express + PostgreSQL
 * ================================
 * Para rodar:
 *   npm install
 *   node server.js
 */

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "pizzamaster_secret_2026";

// ── MIDDLEWARES ──────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── POSTGRES CONNECTION ──────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "pizzamaster",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "analista128",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Query helper
const db = {
  query: (text, params) => pool.query(text, params),
};

// ── AUTH MIDDLEWARE ───────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token não fornecido" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// ── HEALTH CHECK ─────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", timestamp: new Date(), db: "connected" });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", db: "disconnected", error: err.message });
  }
});

// ════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await db.query(
      "SELECT * FROM usuarios WHERE email = $1 AND ativo = true",
      [email],
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(senha, user.senha_hash))) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" },
    );
    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nome, email, senha, role = "atendente" } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    const result = await db.query(
      "INSERT INTO usuarios (nome, email, senha_hash, role) VALUES ($1,$2,$3,$4) RETURNING id,nome,email,role",
      [nome, email, hash, role],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "Email já cadastrado" });
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
// PIZZAS (CARDÁPIO)
// ════════════════════════════════════════════════════

// GET /api/pizzas
app.get("/api/pizzas", async (req, res) => {
  try {
    const { categoria, ativo } = req.query;
    let q = "SELECT * FROM pizzas WHERE 1=1";
    const params = [];
    if (categoria) {
      params.push(categoria);
      q += ` AND categoria = $${params.length}`;
    }
    if (ativo !== undefined) {
      params.push(ativo === "true");
      q += ` AND ativo = $${params.length}`;
    }
    q += " ORDER BY nome ASC";
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pizzas/:id
app.get("/api/pizzas/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM pizzas WHERE id = $1", [
      req.params.id,
    ]);
    if (!result.rows[0])
      return res.status(404).json({ error: "Pizza não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pizzas
app.post("/api/pizzas", authMiddleware, async (req, res) => {
  try {
    const {
      nome,
      categoria,
      ingredientes,
      descricao,
      preco_p,
      preco_m,
      preco_g,
      emoji,
    } = req.body;
    const result = await db.query(
      `
      INSERT INTO pizzas (nome, categoria, ingredientes, descricao, preco_p, preco_m, preco_g, emoji)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        nome,
        categoria,
        ingredientes,
        descricao,
        preco_p,
        preco_m,
        preco_g,
        emoji || "🍕",
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/pizzas/:id
app.put("/api/pizzas/:id", authMiddleware, async (req, res) => {
  try {
    const {
      nome,
      categoria,
      ingredientes,
      descricao,
      preco_p,
      preco_m,
      preco_g,
      emoji,
      ativo,
    } = req.body;
    const result = await db.query(
      `
      UPDATE pizzas SET nome=$1, categoria=$2, ingredientes=$3, descricao=$4,
      preco_p=$5, preco_m=$6, preco_g=$7, emoji=$8, ativo=$9, updated_at=NOW()
      WHERE id=$10 RETURNING *`,
      [
        nome,
        categoria,
        ingredientes,
        descricao,
        preco_p,
        preco_m,
        preco_g,
        emoji,
        ativo,
        req.params.id,
      ],
    );
    if (!result.rows[0])
      return res.status(404).json({ error: "Pizza não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/pizzas/:id
app.delete("/api/pizzas/:id", authMiddleware, async (req, res) => {
  try {
    await db.query("UPDATE pizzas SET ativo=false WHERE id=$1", [
      req.params.id,
    ]);
    res.json({ message: "Pizza desativada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
// CLIENTES
// ════════════════════════════════════════════════════

// GET /api/clientes
app.get("/api/clientes", authMiddleware, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let q = `SELECT c.*, 
      COUNT(p.id) as total_pedidos,
      COALESCE(SUM(p.total), 0) as total_gasto
      FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id
      WHERE c.ativo = true`;
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      q += ` AND (c.nome ILIKE $${params.length} OR c.telefone ILIKE $${params.length} OR c.email ILIKE $${params.length})`;
    }
    q += ` GROUP BY c.id ORDER BY c.nome LIMIT ${limit} OFFSET ${offset}`;
    const result = await db.query(q, params);
    const count = await db.query(
      "SELECT COUNT(*) FROM clientes WHERE ativo = true",
    );
    res.json({
      data: result.rows,
      total: parseInt(count.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clientes/:id
app.get("/api/clientes/:id", authMiddleware, async (req, res) => {
  try {
    const cli = await db.query("SELECT * FROM clientes WHERE id=$1", [
      req.params.id,
    ]);
    if (!cli.rows[0])
      return res.status(404).json({ error: "Cliente não encontrado" });
    const pedidos = await db.query(
      "SELECT * FROM pedidos WHERE cliente_id=$1 ORDER BY created_at DESC LIMIT 10",
      [req.params.id],
    );
    res.json({ ...cli.rows[0], pedidos: pedidos.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clientes
app.post("/api/clientes", authMiddleware, async (req, res) => {
  try {
    const {
      nome,
      cpf,
      telefone,
      email,
      endereco,
      bairro,
      cep,
      cidade,
      data_nascimento,
    } = req.body;
    const result = await db.query(
      `
      INSERT INTO clientes (nome, cpf, telefone, email, endereco, bairro, cep, cidade, data_nascimento)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        nome,
        cpf,
        telefone,
        email,
        endereco,
        bairro,
        cep,
        cidade || "São Paulo",
        data_nascimento,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "CPF ou email já cadastrado" });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clientes/:id
app.put("/api/clientes/:id", authMiddleware, async (req, res) => {
  try {
    const { nome, cpf, telefone, email, endereco, bairro, cep, cidade } =
      req.body;
    const result = await db.query(
      `
      UPDATE clientes SET nome=$1, cpf=$2, telefone=$3, email=$4, endereco=$5, 
      bairro=$6, cep=$7, cidade=$8, updated_at=NOW() WHERE id=$9 RETURNING *`,
      [
        nome,
        cpf,
        telefone,
        email,
        endereco,
        bairro,
        cep,
        cidade,
        req.params.id,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/clientes/:id
app.delete("/api/clientes/:id", authMiddleware, async (req, res) => {
  try {
    await db.query("UPDATE clientes SET ativo=false WHERE id=$1", [
      req.params.id,
    ]);
    res.json({ message: "Cliente desativado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
// PEDIDOS
// ════════════════════════════════════════════════════

// GET /api/pedidos
app.get("/api/pedidos", authMiddleware, async (req, res) => {
  try {
    const { status, data_inicio, data_fim, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    let q = `SELECT p.*, c.nome as cliente_nome, c.telefone as cliente_tel,
      json_agg(json_build_object('pizza', pz.nome, 'tamanho', ip.tamanho, 'qtd', ip.quantidade, 'preco', ip.preco_unit)) as itens
      FROM pedidos p 
      LEFT JOIN clientes c ON p.cliente_id = c.id
      LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
      LEFT JOIN pizzas pz ON pz.id = ip.pizza_id
      WHERE 1=1`;
    const params = [];
    if (status) {
      params.push(status);
      q += ` AND p.status = $${params.length}`;
    }
    if (data_inicio) {
      params.push(data_inicio);
      q += ` AND p.created_at >= $${params.length}`;
    }
    if (data_fim) {
      params.push(data_fim);
      q += ` AND p.created_at <= $${params.length}`;
    }
    q += ` GROUP BY p.id, c.nome, c.telefone ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const result = await db.query(q, params);
    res.json({ data: result.rows, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pedidos/:id
app.get("/api/pedidos/:id", authMiddleware, async (req, res) => {
  try {
    const pedido = await db.query(
      `
      SELECT p.*, c.nome as cliente_nome, c.telefone, c.email
      FROM pedidos p LEFT JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = $1`,
      [req.params.id],
    );
    if (!pedido.rows[0])
      return res.status(404).json({ error: "Pedido não encontrado" });
    const itens = await db.query(
      `
      SELECT ip.*, pz.nome as pizza_nome, pz.emoji FROM itens_pedido ip 
      JOIN pizzas pz ON pz.id = ip.pizza_id WHERE ip.pedido_id = $1`,
      [req.params.id],
    );
    res.json({ ...pedido.rows[0], itens: itens.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pedidos
app.post("/api/pedidos", authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const {
      cliente_id,
      cliente_nome,
      endereco_entrega,
      tipo,
      forma_pagamento,
      taxa_entrega = 5.0,
      desconto = 0,
      observacoes,
      itens,
    } = req.body;

    let subtotal = 0;
    for (const item of itens) {
      const pizza = await client.query("SELECT * FROM pizzas WHERE id = $1", [
        item.pizza_id,
      ]);
      if (!pizza.rows[0])
        throw new Error(`Pizza ${item.pizza_id} não encontrada`);
      const precoMap = {
        P: pizza.rows[0].preco_p,
        M: pizza.rows[0].preco_m,
        G: pizza.rows[0].preco_g,
      };
      subtotal += precoMap[item.tamanho] * item.quantidade;
    }
    const total = subtotal + parseFloat(taxa_entrega) - parseFloat(desconto);

    const pedidoResult = await client.query(
      `
      INSERT INTO pedidos (cliente_id, cliente_nome_avulso, endereco_entrega, tipo, forma_pagamento, 
        subtotal, taxa_entrega, desconto, total, observacoes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'recebido') RETURNING *`,
      [
        cliente_id || null,
        cliente_nome,
        endereco_entrega,
        tipo,
        forma_pagamento,
        subtotal,
        taxa_entrega,
        desconto,
        total,
        observacoes,
      ],
    );

    const pedido = pedidoResult.rows[0];
    for (const item of itens) {
      const pizza = await client.query("SELECT * FROM pizzas WHERE id = $1", [
        item.pizza_id,
      ]);
      const precoMap = {
        P: pizza.rows[0].preco_p,
        M: pizza.rows[0].preco_m,
        G: pizza.rows[0].preco_g,
      };
      await client.query(
        `
        INSERT INTO itens_pedido (pedido_id, pizza_id, tamanho, quantidade, preco_unit, preco_total)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          pedido.id,
          item.pizza_id,
          item.tamanho,
          item.quantidade,
          precoMap[item.tamanho],
          precoMap[item.tamanho] * item.quantidade,
        ],
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ ...pedido, itens });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PATCH /api/pedidos/:id/status
app.patch("/api/pedidos/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = [
      "recebido",
      "preparando",
      "entrega",
      "entregue",
      "cancelado",
    ];
    if (!validStatus.includes(status))
      return res.status(400).json({ error: "Status inválido" });
    const result = await db.query(
      "UPDATE pedidos SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
      [status, req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
// ESTOQUE
// ════════════════════════════════════════════════════

// GET /api/estoque
app.get("/api/estoque", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *, 
        CASE WHEN quantidade_atual <= 0 THEN 'esgotado'
             WHEN quantidade_atual < quantidade_minima THEN 'baixo'
             ELSE 'ok' END as status_estoque
      FROM estoque ORDER BY categoria, produto`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/estoque
app.post("/api/estoque", authMiddleware, async (req, res) => {
  try {
    const {
      produto,
      categoria,
      quantidade_atual,
      quantidade_minima,
      unidade,
      preco_custo,
    } = req.body;
    const result = await db.query(
      `
      INSERT INTO estoque (produto, categoria, quantidade_atual, quantidade_minima, unidade, preco_custo)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        produto,
        categoria,
        quantidade_atual,
        quantidade_minima,
        unidade,
        preco_custo,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/estoque/:id/repor
app.patch("/api/estoque/:id/repor", authMiddleware, async (req, res) => {
  try {
    const { quantidade } = req.body;
    const result = await db.query(
      `
      UPDATE estoque SET quantidade_atual = quantidade_atual + $1, updated_at=NOW()
      WHERE id=$2 RETURNING *`,
      [quantidade, req.params.id],
    );
    await db.query(
      `
      INSERT INTO movimentacoes_estoque (estoque_id, tipo, quantidade, usuario_id, observacao)
      VALUES ($1, 'entrada', $2, $3, 'Reposição manual')`,
      [req.params.id, quantidade, req.user?.id || 1],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
// FINANCEIRO / DASHBOARD
// ════════════════════════════════════════════════════

// GET /api/dashboard
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const [
      pedidosHoje,
      faturamentoHoje,
      clientesAtivos,
      ticketMedio,
      topPizzas,
      vendasSemana,
    ] = await Promise.all([
      db.query(
        `SELECT COUNT(*) FROM pedidos WHERE DATE(created_at) = $1 AND status != 'cancelado'`,
        [hoje],
      ),
      db.query(
        `SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE DATE(created_at) = $1 AND status != 'cancelado'`,
        [hoje],
      ),
      db.query(`SELECT COUNT(*) FROM clientes WHERE ativo = true`),
      db.query(
        `SELECT COALESCE(AVG(total), 0) as media FROM pedidos WHERE status = 'entregue'`,
      ),
      db.query(`
        SELECT pz.nome, pz.emoji, COUNT(ip.id) as vendas, SUM(ip.quantidade) as unidades
        FROM itens_pedido ip JOIN pizzas pz ON pz.id = ip.pizza_id
        GROUP BY pz.id, pz.nome, pz.emoji ORDER BY unidades DESC LIMIT 5`),
      db.query(`
        SELECT DATE(created_at) as dia, SUM(total) as faturamento, COUNT(*) as pedidos
        FROM pedidos WHERE created_at >= NOW() - INTERVAL '7 days' AND status != 'cancelado'
        GROUP BY DATE(created_at) ORDER BY dia ASC`),
    ]);
    res.json({
      pedidosHoje: parseInt(pedidosHoje.rows[0].count),
      faturamentoHoje: parseFloat(faturamentoHoje.rows[0].total),
      clientesAtivos: parseInt(clientesAtivos.rows[0].count),
      ticketMedio: parseFloat(ticketMedio.rows[0].media),
      topPizzas: topPizzas.rows,
      vendasSemana: vendasSemana.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/relatorios/vendas
app.get("/api/relatorios/vendas", authMiddleware, async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    const result = await db.query(
      `
      SELECT 
        DATE(created_at) as data,
        COUNT(*) as total_pedidos,
        SUM(total) as faturamento,
        AVG(total) as ticket_medio,
        COUNT(CASE WHEN status = 'cancelado' THEN 1 END) as cancelados
      FROM pedidos 
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at) ORDER BY data ASC`,
      [data_inicio || "2026-01-01", data_fim || new Date().toISOString()],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ERROR HANDLER ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// ── START ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🍕 PizzaMaster Pro Backend rodando na porta ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
