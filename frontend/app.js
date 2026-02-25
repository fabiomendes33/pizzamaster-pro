/* ==========================================
   PIZZAMASTER PRO — APP.JS
   Conecta com Backend Node/Express + PostgreSQL
   ========================================== */

// ── CONFIG ──────────────────────────────────────────
const API_BASE = "http://localhost:3001/api";

// ── STATE ────────────────────────────────────────────
let state = {
  pizzas: [],
  pedidos: [],
  clientes: [],
  estoque: [],
  transacoes: [],
  cart: [],
  currentPage: "dashboard",
};

// ── PIZZA DATA (demo + API) ──────────────────────────
const DEFAULT_PIZZAS = [
  {
    id: 1,
    nome: "Margherita",
    emoji: "🍕",
    categoria: "tradicional",
    ingredientes: "Tomate, mussarela, manjericão fresco",
    preco_p: 29.9,
    preco_m: 39.9,
    preco_g: 49.9,
    vendas: 142,
  },
  {
    id: 2,
    nome: "Pepperoni",
    emoji: "🍕",
    categoria: "especial",
    ingredientes: "Pepperoni artesanal, mussarela, tomate",
    preco_p: 34.9,
    preco_m: 44.9,
    preco_g: 59.9,
    vendas: 128,
  },
  {
    id: 3,
    nome: "Quatro Queijos",
    emoji: "🧀",
    categoria: "especial",
    ingredientes: "Mussarela, cheddar, parmesão, gorgonzola",
    preco_p: 36.9,
    preco_m: 48.9,
    preco_g: 62.9,
    vendas: 98,
  },
  {
    id: 4,
    nome: "Portuguesa",
    emoji: "🍳",
    categoria: "tradicional",
    ingredientes: "Presunto, ovo, cebola, azeitona, mussarela",
    preco_p: 32.9,
    preco_m: 42.9,
    preco_g: 55.9,
    vendas: 87,
  },
  {
    id: 5,
    nome: "Frango c/ Catupiry",
    emoji: "🐔",
    categoria: "especial",
    ingredientes: "Frango desfiado, catupiry, milho",
    preco_p: 33.9,
    preco_m: 44.9,
    preco_g: 58.9,
    vendas: 115,
  },
  {
    id: 6,
    nome: "Calabresa",
    emoji: "🌶️",
    categoria: "tradicional",
    ingredientes: "Calabresa fatiada, cebola, azeitona, mussarela",
    preco_p: 30.9,
    preco_m: 40.9,
    preco_g: 52.9,
    vendas: 134,
  },
  {
    id: 7,
    nome: "Napolitana",
    emoji: "🍅",
    categoria: "tradicional",
    ingredientes: "Tomate fresco, mussarela, alho, manjericão",
    preco_p: 31.9,
    preco_m: 41.9,
    preco_g: 53.9,
    vendas: 67,
  },
  {
    id: 8,
    nome: "Strogonoff",
    emoji: "🥩",
    categoria: "premium",
    ingredientes: "Strogonoff de carne, mussarela, batata palha",
    preco_p: 39.9,
    preco_m: 52.9,
    preco_g: 68.9,
    vendas: 76,
  },
  {
    id: 9,
    nome: "Mexicana",
    emoji: "🌮",
    categoria: "premium",
    ingredientes: "Carne moída, jalapeño, pimenta, queijo gouda",
    preco_p: 38.9,
    preco_m: 51.9,
    preco_g: 66.9,
    vendas: 55,
  },
  {
    id: 10,
    nome: "Banana Nevada",
    emoji: "🍌",
    categoria: "doce",
    ingredientes: "Banana, açúcar, canela, neve de mussarela",
    preco_p: 28.9,
    preco_m: 38.9,
    preco_g: 48.9,
    vendas: 82,
  },
  {
    id: 11,
    nome: "Nutella c/ Morango",
    emoji: "🍓",
    categoria: "doce",
    ingredientes: "Nutella, morangos frescos, granulado",
    preco_p: 35.9,
    preco_m: 46.9,
    preco_g: 59.9,
    vendas: 73,
  },
  {
    id: 12,
    nome: "Trufa c/ Nozes",
    emoji: "🍄",
    categoria: "premium",
    ingredientes: "Creme de trufa, nozes, gorgonzola, mel",
    preco_p: 45.9,
    preco_m: 60.9,
    preco_g: 78.9,
    vendas: 41,
  },
];

const DEFAULT_CLIENTES = [
  {
    id: 1,
    nome: "Carlos Silva",
    telefone: "(11) 98765-4321",
    email: "carlos@email.com",
    endereco: "Rua das Flores, 100",
    pedidos: 24,
    total: 1256.8,
  },
  {
    id: 2,
    nome: "Ana Costa",
    telefone: "(11) 97654-3210",
    email: "ana@email.com",
    endereco: "Av. Brasil, 500",
    pedidos: 18,
    total: 897.6,
  },
  {
    id: 3,
    nome: "João Ferreira",
    telefone: "(11) 96543-2109",
    email: "joao@email.com",
    endereco: "Rua São Paulo, 250",
    pedidos: 31,
    total: 1620.3,
  },
  {
    id: 4,
    nome: "Maria Oliveira",
    telefone: "(11) 95432-1098",
    email: "maria@email.com",
    endereco: "Rua Liberdade, 88",
    pedidos: 12,
    total: 598.2,
  },
  {
    id: 5,
    nome: "Pedro Santos",
    telefone: "(11) 94321-0987",
    email: "pedro@email.com",
    endereco: "Av. Paulista, 1000",
    pedidos: 27,
    total: 1380.5,
  },
];

const DEFAULT_ESTOQUE = [
  {
    id: 1,
    produto: "Massa de Pizza",
    categoria: "Base",
    atual: 80,
    minimo: 20,
    unidade: "kg",
  },
  {
    id: 2,
    produto: "Molho de Tomate",
    categoria: "Base",
    atual: 45,
    minimo: 15,
    unidade: "L",
  },
  {
    id: 3,
    produto: "Mussarela",
    categoria: "Queijo",
    atual: 35,
    minimo: 10,
    unidade: "kg",
  },
  {
    id: 4,
    produto: "Pepperoni",
    categoria: "Carne",
    atual: 12,
    minimo: 8,
    unidade: "kg",
  },
  {
    id: 5,
    produto: "Calabresa",
    categoria: "Carne",
    atual: 7,
    minimo: 8,
    unidade: "kg",
  },
  {
    id: 6,
    produto: "Frango",
    categoria: "Carne",
    atual: 25,
    minimo: 10,
    unidade: "kg",
  },
  {
    id: 7,
    produto: "Catupiry",
    categoria: "Queijo",
    atual: 18,
    minimo: 5,
    unidade: "kg",
  },
  {
    id: 8,
    produto: "Caixas P (25cm)",
    categoria: "Embalagem",
    atual: 150,
    minimo: 50,
    unidade: "un",
  },
  {
    id: 9,
    produto: "Caixas M (30cm)",
    categoria: "Embalagem",
    atual: 200,
    minimo: 80,
    unidade: "un",
  },
  {
    id: 10,
    produto: "Caixas G (35cm)",
    categoria: "Embalagem",
    atual: 3,
    minimo: 50,
    unidade: "un",
  },
];

const DEFAULT_PEDIDOS = [
  {
    id: "#0021",
    cliente: "Carlos Silva",
    items: "1x Margherita G, 1x Refri",
    total: 63.9,
    status: "preparando",
    tipo: "entrega",
    hora: "18:42",
    telefone: "(11) 98765-4321",
  },
  {
    id: "#0022",
    cliente: "Ana Costa",
    items: "2x Pepperoni M",
    total: 89.8,
    status: "recebido",
    tipo: "retirada",
    hora: "18:51",
    telefone: "(11) 97654-3210",
  },
  {
    id: "#0023",
    cliente: "João Ferreira",
    items: "1x Quatro Queijos G",
    total: 62.9,
    status: "entrega",
    tipo: "entrega",
    hora: "18:15",
    telefone: "(11) 96543-2109",
  },
  {
    id: "#0024",
    cliente: "Maria Oliveira",
    items: "1x Banana Nevada P, 1x Nutella M",
    total: 74.8,
    status: "entregue",
    tipo: "entrega",
    hora: "17:38",
    telefone: "(11) 95432-1098",
  },
  {
    id: "#0025",
    cliente: "Pedro Santos",
    items: "1x Mexicana G, 1x Frango M",
    total: 110.8,
    status: "recebido",
    tipo: "local",
    hora: "19:02",
    telefone: "(11) 94321-0987",
  },
];

// ── INIT ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  state.pizzas = [...DEFAULT_PIZZAS];
  state.clientes = [...DEFAULT_CLIENTES];
  state.estoque = [...DEFAULT_ESTOQUE];
  state.pedidos = [...DEFAULT_PEDIDOS];

  initNav();
  initDashboard();
  renderCardapio();
  renderKanban();
  renderClientes();
  renderEstoque();
  renderFinanceiro();
  initOrderModal();

  // Simulação tempo real
  setInterval(simulateLiveOrder, 15000);
  document
    .getElementById("newOrderBtn")
    .addEventListener("click", () => openModal("modal-order"));
  document
    .getElementById("menuToggle")
    .addEventListener("click", toggleSidebar);
});

// ── NAVIGATION ───────────────────────────────────────
function initNav() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active"));

  document.getElementById("page-" + page)?.classList.add("active");
  document.querySelector(`[data-page="${page}"]`)?.classList.add("active");
  document.getElementById("pageTitle").textContent =
    {
      dashboard: "Dashboard",
      cardapio: "Cardápio",
      pedidos: "Pedidos",
      clientes: "Clientes",
      estoque: "Estoque",
      financeiro: "Financeiro",
      relatorios: "Relatórios",
      configuracoes: "Configurações",
    }[page] || page;

  state.currentPage = page;
  if (window.innerWidth < 900)
    document.getElementById("sidebar").classList.remove("open");
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

// ── DASHBOARD ────────────────────────────────────────
function initDashboard() {
  // KPIs
  animateNumber("kpi-pedidos", 47);
  animateValue("kpi-faturamento", "R$ ", 3840.5, 2);
  animateNumber("kpi-clientes", 284);
  document.getElementById("kpi-tempo").textContent = "38 min";

  // Live Orders
  renderLiveOrders();

  // Top Pizzas
  renderTopPizzas();

  // Chart
  initSalesChart();
}

function animateNumber(id, target) {
  let current = 0;
  const step = target / 40;
  const el = document.getElementById(id);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, 30);
}

function animateValue(id, prefix, target, decimals) {
  let current = 0;
  const step = target / 40;
  const el = document.getElementById(id);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = prefix + current.toFixed(decimals).replace(".", ",");
    if (current >= target) clearInterval(timer);
  }, 30);
}

function renderLiveOrders() {
  const container = document.getElementById("liveOrders");
  container.innerHTML = state.pedidos
    .map(
      (p) => `
    <div class="order-live-item">
      <div>
        <strong>${p.id}</strong> — ${p.cliente}
        <div style="font-size:0.78rem;color:var(--text-muted)">${p.items}</div>
      </div>
      <div style="text-align:right">
        <div><span class="order-live-status status-${p.status}">${statusLabel(p.status)}</span></div>
        <div style="font-size:0.78rem;color:var(--accent);font-weight:700;margin-top:4px">R$ ${p.total.toFixed(2).replace(".", ",")}</div>
      </div>
    </div>
  `,
    )
    .join("");
}

function renderTopPizzas() {
  const sorted = [...state.pizzas]
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, 6);
  document.getElementById("topPizzas").innerHTML = sorted
    .map(
      (p, i) => `
    <div class="top-pizza-item">
      <span class="top-pizza-rank">${i + 1}</span>
      <span style="font-size:1.4rem">${p.emoji}</span>
      <span class="top-pizza-name">${p.nome}</span>
      <span class="top-pizza-count">${p.vendas} un.</span>
    </div>
  `,
    )
    .join("");
}

function initSalesChart() {
  const ctx = document.getElementById("salesChart")?.getContext("2d");
  if (!ctx) return;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      datasets: [
        {
          label: "Faturamento (R$)",
          data: [2800, 3200, 2900, 3800, 4500, 6200, 5100],
          backgroundColor: "rgba(255,69,0,0.7)",
          borderColor: "#FF4500",
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: "Pedidos",
          data: [32, 38, 34, 45, 56, 78, 62],
          backgroundColor: "rgba(255,215,0,0.5)",
          borderColor: "#FFD700",
          borderWidth: 2,
          borderRadius: 8,
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#F0F0F0",
            font: { family: "Nunito", weight: "700" },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#888" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          ticks: { color: "#888", callback: (v) => "R$" + v },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y2: {
          position: "right",
          ticks: { color: "#FFD700" },
          grid: { display: false },
        },
      },
    },
  });
}

// ── CARDÁPIO ─────────────────────────────────────────
function renderCardapio(filter = "all") {
  const pizzas =
    filter === "all"
      ? state.pizzas
      : state.pizzas.filter((p) => p.categoria === filter);
  const badgeMap = {
    premium: "badge-premium",
    especial: "badge-especial",
    tradicional: "badge-tradicional",
    doce: "badge-doce",
  };
  const catLabel = {
    premium: "Premium",
    especial: "Especial",
    tradicional: "Tradicional",
    doce: "Doce",
  };

  document.getElementById("pizzaGrid").innerHTML = pizzas
    .map(
      (p) => `
    <div class="pizza-card" data-id="${p.id}">
      <div class="pizza-visual">
        <div class="pizza-bg"></div>
        <span class="pizza-emoji" style="font-size:5rem">${p.emoji}</span>
        <span class="pizza-badge ${badgeMap[p.categoria] || ""}">${catLabel[p.categoria] || p.categoria}</span>
      </div>
      <div class="pizza-info">
        <h3>${p.nome}</h3>
        <p class="pizza-ingredients">${p.ingredientes}</p>
        <div class="pizza-prices">
          <div class="price-tag"><span class="size">Pequena</span><span class="price">R$ ${p.preco_p.toFixed(2).replace(".", ",")}</span></div>
          <div class="price-tag"><span class="size">Média</span><span class="price">R$ ${p.preco_m.toFixed(2).replace(".", ",")}</span></div>
          <div class="price-tag"><span class="size">Grande</span><span class="price">R$ ${p.preco_g.toFixed(2).replace(".", ",")}</span></div>
        </div>
        <div class="pizza-actions" style="margin-top:12px">
          <button class="btn btn-sm btn-primary" onclick="addToCartQuick(${p.id})">🛒 Pedir</button>
          <button class="btn btn-sm btn-secondary" onclick="editPizza(${p.id})">✏️ Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deletePizza(${p.id})">🗑️</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  // Filter tabs
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderCardapio(tab.dataset.cat);
    });
  });
}

function deletePizza(id) {
  state.pizzas = state.pizzas.filter((p) => p.id !== id);
  renderCardapio();
  showToast("Pizza removida do cardápio", "success");
  // API: fetch(`${API_BASE}/pizzas/${id}`, { method: 'DELETE' })
}

function editPizza(id) {
  const p = state.pizzas.find((x) => x.id === id);
  if (!p) return;
  document.getElementById("pizza-nome").value = p.nome;
  document.getElementById("pizza-categoria").value = p.categoria;
  document.getElementById("pizza-ingredientes").value = p.ingredientes;
  document.getElementById("pizza-preco-p").value = p.preco_p;
  document.getElementById("pizza-preco-m").value = p.preco_m;
  document.getElementById("pizza-preco-g").value = p.preco_g;
  document.getElementById("pizza-emoji").value = p.emoji;
  openModal("modal-pizza");
}

function savePizza() {
  const nome = document.getElementById("pizza-nome").value;
  if (!nome) {
    showToast("Preencha o nome da pizza", "error");
    return;
  }

  const newPizza = {
    id: Date.now(),
    nome,
    categoria: document.getElementById("pizza-categoria").value,
    ingredientes: document.getElementById("pizza-ingredientes").value,
    preco_p: parseFloat(document.getElementById("pizza-preco-p").value) || 0,
    preco_m: parseFloat(document.getElementById("pizza-preco-m").value) || 0,
    preco_g: parseFloat(document.getElementById("pizza-preco-g").value) || 0,
    emoji: document.getElementById("pizza-emoji").value || "🍕",
    vendas: 0,
  };

  state.pizzas.push(newPizza);
  renderCardapio();
  closeModal("modal-pizza");
  showToast(`✅ Pizza "${nome}" adicionada!`, "success");

  // API: fetch(`${API_BASE}/pizzas`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newPizza) })
}

// ── KANBAN PEDIDOS ───────────────────────────────────
function renderKanban() {
  ["recebido", "preparando", "entrega", "entregue"].forEach((status) => {
    const items = state.pedidos.filter((p) => p.status === status);
    document.getElementById("count-" + status).textContent = items.length;
    document.getElementById("kanban-" + status).innerHTML = items
      .map(
        (p) => `
      <div class="kanban-card" onclick="openOrderDetail('${p.id}')">
        <div class="kanban-card-header">
          <span class="kanban-card-id">${p.id}</span>
          <span class="kanban-card-time">⏱ ${p.hora}</span>
        </div>
        <div class="kanban-card-client">${p.cliente}</div>
        <div class="kanban-card-items">${p.items}</div>
        <div class="kanban-card-footer">
          <span class="kanban-card-total">R$ ${p.total.toFixed(2).replace(".", ",")}</span>
          <span class="kanban-card-type">${tipoIcon(p.tipo)} ${p.tipo}</span>
          ${status !== "entregue" ? `<button class="kanban-advance-btn" onclick="event.stopPropagation();advanceOrder('${p.id}')">Avançar →</button>` : ""}
        </div>
      </div>
    `,
      )
      .join("");
  });
}

function advanceOrder(id) {
  const order = state.pedidos.find((p) => p.id === id);
  if (!order) return;
  const next = {
    recebido: "preparando",
    preparando: "entrega",
    entrega: "entregue",
  };
  if (next[order.status]) {
    order.status = next[order.status];
    renderKanban();
    renderLiveOrders();
    showToast(
      `Pedido ${id} avançado → ${statusLabel(order.status)}`,
      "success",
    );
  }
}

function openOrderDetail(id) {
  const order = state.pedidos.find((p) => p.id === id);
  if (!order) return;
  showToast(`📋 Pedido ${id}: ${order.cliente} | ${order.items}`, "success");
}

function tipoIcon(tipo) {
  return { entrega: "🛵", retirada: "🏪", local: "🍽️" }[tipo] || "📦";
}

// ── CLIENTES ─────────────────────────────────────────
function renderClientes() {
  document.getElementById("clientesBody").innerHTML = state.clientes
    .map(
      (c) => `
    <tr>
      <td><strong>#${c.id}</strong></td>
      <td><strong>${c.nome}</strong></td>
      <td>${c.telefone}</td>
      <td>${c.email}</td>
      <td>${c.endereco}</td>
      <td><span style="color:var(--blue);font-weight:700">${c.pedidos}</span></td>
      <td><span style="color:var(--green);font-weight:700">R$ ${c.total.toFixed(2).replace(".", ",")}</span></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="showToast('WhatsApp: ${c.telefone}')">💬</button>
        <button class="btn btn-sm btn-secondary" onclick="editCliente(${c.id})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCliente(${c.id})">🗑️</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function saveCliente() {
  const nome = document.getElementById("cli-nome").value;
  if (!nome) {
    showToast("Preencha o nome", "error");
    return;
  }
  const c = {
    id: state.clientes.length + 1,
    nome,
    telefone: document.getElementById("cli-tel").value,
    email: document.getElementById("cli-email").value,
    endereco: document.getElementById("cli-end").value,
    pedidos: 0,
    total: 0,
  };
  state.clientes.push(c);
  renderClientes();
  closeModal("modal-cliente");
  showToast(`✅ Cliente "${nome}" cadastrado!`, "success");
}

function deleteCliente(id) {
  state.clientes = state.clientes.filter((c) => c.id !== id);
  renderClientes();
  showToast("Cliente removido", "success");
}

// ── ESTOQUE ──────────────────────────────────────────
function renderEstoque() {
  document.getElementById("estoqueBody").innerHTML = state.estoque
    .map((e) => {
      const pct = e.atual / e.minimo;
      let status, cls;
      if (e.atual <= 0) {
        status = "⛔ Esgotado";
        cls = "stock-out";
      } else if (pct < 1) {
        status = "⚠️ Baixo";
        cls = "stock-low";
      } else {
        status = "✅ OK";
        cls = "stock-ok";
      }
      return `<tr>
      <td><strong>${e.produto}</strong></td>
      <td>${e.categoria}</td>
      <td>${e.atual} ${e.unidade}</td>
      <td>${e.minimo} ${e.unidade}</td>
      <td><span class="${cls}">${status}</span></td>
      <td><button class="btn btn-sm btn-outline" onclick="repor(${e.id})">+ Repor</button></td>
    </tr>`;
    })
    .join("");
}

function repor(id) {
  const item = state.estoque.find((e) => e.id === id);
  if (item) {
    const qty = parseInt(
      prompt(`Quantidade a repor para "${item.produto}":`) || 0,
    );
    if (qty > 0) {
      item.atual += qty;
      renderEstoque();
      showToast(`✅ Estoque de ${item.produto} atualizado!`, "success");
    }
  }
}

// ── FINANCEIRO ───────────────────────────────────────
function renderFinanceiro() {
  const receita = 48650.8;
  const despesa = 15420.3;
  const lucro = receita - despesa;
  animateValue("fin-receita", "R$ ", receita, 2);
  animateValue("fin-despesa", "R$ ", despesa, 2);
  animateValue("fin-lucro", "R$ ", lucro, 2);

  const transacoes = [
    {
      data: "24/02/2026",
      desc: "Pedidos do dia",
      tipo: "Receita",
      valor: 3840.5,
      status: "Concluído",
    },
    {
      data: "24/02/2026",
      desc: "Fornecedor de insumos",
      tipo: "Despesa",
      valor: -890.0,
      status: "Pago",
    },
    {
      data: "23/02/2026",
      desc: "Pedidos do dia",
      tipo: "Receita",
      valor: 4120.8,
      status: "Concluído",
    },
    {
      data: "23/02/2026",
      desc: "Folha de pagamento",
      tipo: "Despesa",
      valor: -3200.0,
      status: "Pago",
    },
    {
      data: "22/02/2026",
      desc: "Pedidos do dia",
      tipo: "Receita",
      valor: 3560.2,
      status: "Concluído",
    },
    {
      data: "22/02/2026",
      desc: "Aluguel",
      tipo: "Despesa",
      valor: -4500.0,
      status: "Pago",
    },
  ];
  document.getElementById("transacoesBody").innerHTML = transacoes
    .map(
      (t) => `
    <tr>
      <td>${t.data}</td>
      <td>${t.desc}</td>
      <td><span style="color:${t.tipo === "Receita" ? "var(--green)" : "var(--red)"};font-weight:700">${t.tipo}</span></td>
      <td style="color:${t.valor > 0 ? "var(--green)" : "var(--red)"};font-weight:700">${t.valor > 0 ? "+" : ""}R$ ${Math.abs(t.valor).toFixed(2).replace(".", ",")}</td>
      <td><span class="order-live-status status-entregue">${t.status}</span></td>
    </tr>
  `,
    )
    .join("");
}

// ── ORDER MODAL ──────────────────────────────────────
function initOrderModal() {
  const list = document.getElementById("orderPizzaList");
  list.innerHTML = state.pizzas
    .slice(0, 12)
    .map(
      (p) => `
    <div class="pizza-select-item" onclick="addToCart(${p.id})">
      <span class="sel-emoji">${p.emoji}</span>
      <strong>${p.nome}</strong>
      <small>R$ ${p.preco_m.toFixed(2).replace(".", ",")}</small>
    </div>
  `,
    )
    .join("");
}

function addToCart(id) {
  const pizza = state.pizzas.find((p) => p.id === id);
  if (!pizza) return;
  const size = "M";
  const price = pizza.preco_m;
  const existingItem = state.cart.find(
    (item) => item.id === id && item.size === size,
  );
  if (existingItem) {
    existingItem.qty++;
  } else {
    state.cart.push({
      id,
      nome: pizza.nome,
      emoji: pizza.emoji,
      size,
      price,
      qty: 1,
    });
  }
  renderCart();
}

function addToCartQuick(id) {
  openModal("modal-order");
  setTimeout(() => addToCart(id), 100);
}

function renderCart() {
  const container = document.getElementById("cartItems");
  if (state.cart.length === 0) {
    container.innerHTML =
      '<p style="color:var(--text-muted);font-size:0.82rem;padding:8px 0">Nenhum item adicionado</p>';
  } else {
    container.innerHTML = state.cart
      .map(
        (item, i) => `
      <div class="cart-item">
        <span>${item.emoji} ${item.nome} (${item.size})</span>
        <span>x${item.qty}</span>
        <span style="color:var(--green);font-weight:700">R$ ${(item.price * item.qty).toFixed(2).replace(".", ",")}</span>
        <button class="cart-remove" onclick="removeFromCart(${i})">×</button>
      </div>
    `,
      )
      .join("");
  }
  const total = state.cart.reduce((acc, i) => acc + i.price * i.qty, 0) + 5;
  document.getElementById("cartTotal").textContent =
    "R$ " + total.toFixed(2).replace(".", ",");
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  renderCart();
}

function saveOrder() {
  if (state.cart.length === 0) {
    showToast("Adicione itens ao pedido", "error");
    return;
  }
  const cliente = document.getElementById("order-cliente").value || "Cliente";
  const order = {
    id: "#" + String(Date.now()).slice(-4),
    cliente,
    items: state.cart.map((i) => `${i.qty}x ${i.nome} ${i.size}`).join(", "),
    total: state.cart.reduce((a, i) => a + i.price * i.qty, 0) + 5,
    status: "recebido",
    tipo: document.getElementById("order-tipo").value,
    hora: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  state.pedidos.unshift(order);
  state.cart = [];
  renderCart();
  renderKanban();
  renderLiveOrders();
  closeModal("modal-order");
  showToast(`✅ Pedido ${order.id} registrado para ${cliente}!`, "success");

  // API:
  // fetch(`${API_BASE}/pedidos`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(order) })
}

// ── REPORTS ──────────────────────────────────────────
function generateReport(type) {
  const reportResult = document.getElementById("reportResult");
  const reportContent = document.getElementById("reportContent");
  const reportTitle = document.getElementById("reportTitle");
  reportResult.style.display = "block";

  const reports = {
    vendas: {
      title: "📊 Relatório de Vendas — Fevereiro 2026",
      html: `
      <table class="data-table"><thead><tr><th>Produto</th><th>Qtd Vendida</th><th>Receita</th><th>% do Total</th></tr></thead>
      <tbody>${state.pizzas
        .slice(0, 6)
        .map(
          (p) =>
            `<tr><td>${p.emoji} ${p.nome}</td><td>${p.vendas}</td><td>R$ ${(p.vendas * p.preco_m).toFixed(2).replace(".", ",")}</td><td>${((p.vendas / 142) * 100).toFixed(1)}%</td></tr>`,
        )
        .join("")}</tbody></table>
    `,
    },
    clientes: {
      title: "👥 Relatório de Clientes — Top Compradores",
      html: `
      <table class="data-table"><thead><tr><th>Cliente</th><th>Pedidos</th><th>Total Gasto</th><th>Ticket Médio</th></tr></thead>
      <tbody>${state.clientes.map((c) => `<tr><td>${c.nome}</td><td>${c.pedidos}</td><td>R$ ${c.total.toFixed(2).replace(".", ",")}</td><td>R$ ${(c.total / c.pedidos).toFixed(2).replace(".", ",")}</td></tr>`).join("")}</tbody></table>
    `,
    },
    produtos: {
      title: "🍕 Relatório de Produtos",
      html: `
      <table class="data-table"><thead><tr><th>Pizza</th><th>Categoria</th><th>Vendas</th><th>Ranking</th></tr></thead>
      <tbody>${[...state.pizzas]
        .sort((a, b) => b.vendas - a.vendas)
        .map(
          (p, i) =>
            `<tr><td>${p.emoji} ${p.nome}</td><td>${p.categoria}</td><td>${p.vendas} un.</td><td>#${i + 1}</td></tr>`,
        )
        .join("")}</tbody></table>
    `,
    },
    financeiro: {
      title: "💰 DRE — Demonstrativo de Resultado",
      html: `
      <table class="data-table"><thead><tr><th>Conta</th><th>Valor</th><th>%</th></tr></thead>
      <tbody>
        <tr><td><strong>Receita Bruta</strong></td><td style="color:var(--green)"><strong>R$ 48.650,80</strong></td><td>100%</td></tr>
        <tr><td>(-) Custos Operacionais</td><td style="color:var(--red)">R$ -15.420,30</td><td>31.7%</td></tr>
        <tr><td><strong>Lucro Bruto</strong></td><td style="color:var(--green)"><strong>R$ 33.230,50</strong></td><td>68.3%</td></tr>
        <tr><td>(-) Despesas Administrativas</td><td style="color:var(--red)">R$ -6.800,00</td><td>14%</td></tr>
        <tr><td><strong>Lucro Líquido</strong></td><td style="color:var(--accent)"><strong>R$ 26.430,50</strong></td><td>54.3%</td></tr>
      </tbody></table>
    `,
    },
  };

  reportTitle.textContent = reports[type].title;
  reportContent.innerHTML = reports[type].html;
  reportResult.scrollIntoView({ behavior: "smooth" });
}

function exportRelatorio() {
  showToast(
    "📥 Exportação para PDF — integração com backend necessária",
    "success",
  );
}

// ── SIMULATION ───────────────────────────────────────
function simulateLiveOrder() {
  const nomes = [
    "Lucas Pereira",
    "Fernanda Lima",
    "Roberto Alves",
    "Patricia Gomes",
  ];
  const pizzasNames = state.pizzas.map((p) => p.nome);
  const statuses = ["recebido", "preparando"];
  const tipos = ["entrega", "retirada", "local"];
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const pizza = pizzasNames[Math.floor(Math.random() * pizzasNames.length)];
  const order = {
    id: "#" + Math.floor(1000 + Math.random() * 9000),
    cliente: nome,
    items: `1x ${pizza} G`,
    total: 40 + Math.random() * 60,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    tipo: tipos[Math.floor(Math.random() * tipos.length)],
    hora: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  state.pedidos.unshift(order);
  if (state.pedidos.length > 20) state.pedidos.pop();
  renderLiveOrders();
  renderKanban();
  const badge = document.getElementById("notifBadge");
  badge.textContent = parseInt(badge.textContent) + 1;
}

// ── MODALS ───────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add("active");
  if (id === "modal-order") {
    state.cart = [];
    renderCart();
    initOrderModal();
  }
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove("active");
}

// Close modal clicking overlay
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
});

// ── TOAST ────────────────────────────────────────────
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => (toast.className = "toast"), 3500);
}

// ── STATUS LABELS ────────────────────────────────────
function statusLabel(s) {
  return (
    {
      recebido: "📥 Recebido",
      preparando: "🔥 Preparando",
      entrega: "🛵 Em Entrega",
      entregue: "✅ Entregue",
      cancelado: "❌ Cancelado",
    }[s] || s
  );
}

// ── GLOBAL SEARCH ────────────────────────────────────
document.getElementById("globalSearch")?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  if (!q) return;
  const pizza = state.pizzas.find((p) => p.nome.toLowerCase().includes(q));
  if (pizza) {
    navigateTo("cardapio");
    showToast(`🔍 Encontrado: ${pizza.nome}`);
  } else {
    const cli = state.clientes.find((c) => c.nome.toLowerCase().includes(q));
    if (cli) {
      navigateTo("clientes");
      showToast(`🔍 Encontrado: ${cli.nome}`);
    }
  }
});
