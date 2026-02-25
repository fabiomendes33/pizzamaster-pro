-- =====================================================
-- PIZZAMASTER PRO — DATABASE SCHEMA (PostgreSQL)
-- Execute este arquivo para criar o banco de dados
-- =====================================================
-- Comando: psql -U postgres -d pizzamaster -f schema.sql

-- Criar banco (se ainda não existir)
-- CREATE DATABASE pizzamaster;

-- ────────────────────────────────────────────────────
-- EXTENSÕES
-- ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ────────────────────────────────────────────────────
-- ENUMS
-- ────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE categoria_pizza AS ENUM ('tradicional', 'especial', 'premium', 'doce', 'bebida');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tamanho_pizza AS ENUM ('P', 'M', 'G');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE status_pedido AS ENUM ('recebido', 'preparando', 'entrega', 'entregue', 'cancelado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_pedido AS ENUM ('entrega', 'retirada', 'local');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE forma_pagamento AS ENUM ('dinheiro', 'credito', 'debito', 'pix', 'vale_refeicao');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE role_usuario AS ENUM ('admin', 'gerente', 'atendente', 'cozinha', 'entregador');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ────────────────────────────────────────────────────
-- TABELA: USUÁRIOS DO SISTEMA
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  senha_hash  TEXT NOT NULL,
  role        role_usuario DEFAULT 'atendente',
  ativo       BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- ────────────────────────────────────────────────────
-- TABELA: PIZZAS (CARDÁPIO)
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pizzas (
  id           SERIAL PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  categoria    categoria_pizza NOT NULL,
  ingredientes TEXT,
  descricao    TEXT,
  preco_p      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  preco_m      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  preco_g      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  emoji        VARCHAR(10) DEFAULT '🍕',
  foto_url     TEXT,
  ativo        BOOLEAN DEFAULT true,
  destaque     BOOLEAN DEFAULT false,
  vendas_total INT DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pizzas_categoria ON pizzas(categoria);
CREATE INDEX IF NOT EXISTS idx_pizzas_ativo ON pizzas(ativo);

-- ────────────────────────────────────────────────────
-- TABELA: CLIENTES
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(150) NOT NULL,
  cpf             VARCHAR(14) UNIQUE,
  telefone        VARCHAR(20) NOT NULL,
  email           VARCHAR(150) UNIQUE,
  endereco        TEXT,
  numero          VARCHAR(10),
  complemento     VARCHAR(50),
  bairro          VARCHAR(80),
  cidade          VARCHAR(80) DEFAULT 'São Paulo',
  estado          VARCHAR(2) DEFAULT 'SP',
  cep             VARCHAR(9),
  data_nascimento DATE,
  observacoes     TEXT,
  pontos_fidelidade INT DEFAULT 0,
  ativo           BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);

-- ────────────────────────────────────────────────────
-- TABELA: PEDIDOS
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id                    SERIAL PRIMARY KEY,
  numero                VARCHAR(20) UNIQUE DEFAULT 'PED-' || nextval('pedidos_id_seq'),
  cliente_id            INT REFERENCES clientes(id) ON DELETE SET NULL,
  cliente_nome_avulso   VARCHAR(150),
  cliente_tel_avulso    VARCHAR(20),
  endereco_entrega      TEXT,
  tipo                  tipo_pedido NOT NULL DEFAULT 'entrega',
  forma_pagamento       forma_pagamento NOT NULL,
  troco_para            NUMERIC(10, 2),
  status                status_pedido DEFAULT 'recebido',
  subtotal              NUMERIC(10, 2) NOT NULL DEFAULT 0,
  taxa_entrega          NUMERIC(10, 2) DEFAULT 5.00,
  desconto              NUMERIC(10, 2) DEFAULT 0,
  total                 NUMERIC(10, 2) NOT NULL DEFAULT 0,
  observacoes           TEXT,
  tempo_estimado_min    INT DEFAULT 45,
  entregador_id         INT REFERENCES usuarios(id),
  atendente_id          INT REFERENCES usuarios(id),
  cancelamento_motivo   TEXT,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(created_at);

-- ────────────────────────────────────────────────────
-- TABELA: ITENS DO PEDIDO
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS itens_pedido (
  id              SERIAL PRIMARY KEY,
  pedido_id       INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  pizza_id        INT NOT NULL REFERENCES pizzas(id),
  tamanho         tamanho_pizza NOT NULL,
  quantidade      INT NOT NULL DEFAULT 1,
  preco_unit      NUMERIC(10, 2) NOT NULL,
  preco_total     NUMERIC(10, 2) NOT NULL,
  observacoes     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itens_pedido ON itens_pedido(pedido_id);

-- ────────────────────────────────────────────────────
-- TABELA: ESTOQUE
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS estoque (
  id                  SERIAL PRIMARY KEY,
  produto             VARCHAR(150) NOT NULL,
  categoria           VARCHAR(80),
  unidade             VARCHAR(20) DEFAULT 'kg',
  quantidade_atual    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  quantidade_minima   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  preco_custo         NUMERIC(10, 2) DEFAULT 0,
  fornecedor          VARCHAR(100),
  observacoes         TEXT,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- TABELA: MOVIMENTAÇÕES DE ESTOQUE
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id          SERIAL PRIMARY KEY,
  estoque_id  INT NOT NULL REFERENCES estoque(id),
  tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste')),
  quantidade  NUMERIC(10, 2) NOT NULL,
  usuario_id  INT REFERENCES usuarios(id),
  pedido_id   INT REFERENCES pedidos(id),
  observacao  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- TABELA: CONFIGURAÇÕES DO SISTEMA
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS configuracoes (
  id              SERIAL PRIMARY KEY,
  chave           VARCHAR(100) UNIQUE NOT NULL,
  valor           TEXT,
  descricao       TEXT,
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- VIEWS ÚTEIS
-- ────────────────────────────────────────────────────

-- View: Dashboard resumo
CREATE OR REPLACE VIEW v_dashboard AS
SELECT
  (SELECT COUNT(*) FROM pedidos WHERE DATE(created_at) = CURRENT_DATE AND status != 'cancelado') AS pedidos_hoje,
  (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE DATE(created_at) = CURRENT_DATE AND status != 'cancelado') AS faturamento_hoje,
  (SELECT COUNT(*) FROM clientes WHERE ativo = true) AS total_clientes,
  (SELECT COUNT(*) FROM pedidos WHERE status = 'recebido') AS pedidos_recebidos,
  (SELECT COUNT(*) FROM pedidos WHERE status = 'preparando') AS pedidos_preparando,
  (SELECT COUNT(*) FROM pedidos WHERE status = 'entrega') AS pedidos_entrega,
  (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW()) AND status != 'cancelado') AS faturamento_mes;

-- View: Top pizzas
CREATE OR REPLACE VIEW v_top_pizzas AS
SELECT 
  pz.id, pz.nome, pz.emoji, pz.categoria,
  COALESCE(SUM(ip.quantidade), 0) AS total_vendido,
  COALESCE(SUM(ip.preco_total), 0) AS receita_gerada
FROM pizzas pz
LEFT JOIN itens_pedido ip ON ip.pizza_id = pz.id
LEFT JOIN pedidos p ON p.id = ip.pedido_id AND p.status != 'cancelado'
WHERE pz.ativo = true
GROUP BY pz.id, pz.nome, pz.emoji, pz.categoria
ORDER BY total_vendido DESC;

-- ────────────────────────────────────────────────────
-- SEED DATA — DADOS INICIAIS
-- ────────────────────────────────────────────────────

-- Usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, role) VALUES
  ('Administrador', 'admin@pizzamaster.com', '$2a$10$rBnNKmHGXgJqkBnMX5h2Au8VJZLPFGt9EK3PGBQHhbOiEH1pMJGH2', 'admin'),
  ('João Gerente', 'gerente@pizzamaster.com', '$2a$10$rBnNKmHGXgJqkBnMX5h2Au8VJZLPFGt9EK3PGBQHhbOiEH1pMJGH2', 'gerente'),
  ('Maria Atendente', 'atendente@pizzamaster.com', '$2a$10$rBnNKmHGXgJqkBnMX5h2Au8VJZLPFGt9EK3PGBQHhbOiEH1pMJGH2', 'atendente')
ON CONFLICT (email) DO NOTHING;

-- Cardápio de pizzas
INSERT INTO pizzas (nome, categoria, ingredientes, descricao, preco_p, preco_m, preco_g, emoji, destaque) VALUES
  ('Margherita', 'tradicional', 'Molho de tomate, mussarela, manjericão fresco', 'A clássica italiana com sabor inigualável', 29.90, 39.90, 49.90, '🍕', true),
  ('Pepperoni', 'especial', 'Pepperoni artesanal, mussarela, molho de tomate', 'Generosa quantidade de pepperoni premium', 34.90, 44.90, 59.90, '🫓', true),
  ('Quatro Queijos', 'especial', 'Mussarela, cheddar, parmesão, gorgonzola', 'Para os amantes de queijo', 36.90, 48.90, 62.90, '🧀', false),
  ('Portuguesa', 'tradicional', 'Presunto, ovo, cebola, azeitona, mussarela', 'A favorita do Brasil há décadas', 32.90, 42.90, 55.90, '🫒', false),
  ('Frango c/ Catupiry', 'especial', 'Frango desfiado temperado, catupiry, milho', 'Combinação perfeita de sabores', 33.90, 44.90, 58.90, '🐔', true),
  ('Calabresa', 'tradicional', 'Calabresa artesanal, cebola, azeitona, mussarela', 'Recheio generoso de calabresa', 30.90, 40.90, 52.90, '🌶️', false),
  ('Napolitana', 'tradicional', 'Tomate fresco, mussarela, alho, manjericão', 'Sabor mediterrâneo autêntico', 31.90, 41.90, 53.90, '🍅', false),
  ('Strogonoff de Carne', 'premium', 'Strogonoff de carne bovina, mussarela, batata palha', 'Prato que virou pizza irresistível', 39.90, 52.90, 68.90, '🥩', true),
  ('Mexicana', 'premium', 'Carne moída, jalapeño, pimenta dedo-de-moça, queijo gouda', 'Para quem curte um toque apimentado', 38.90, 51.90, 66.90, '🫑', false),
  ('Banana Nevada', 'doce', 'Banana fatiada, açúcar, canela, mussarela', 'Equilíbrio perfeito entre doce e salgado', 28.90, 38.90, 48.90, '🍌', false),
  ('Nutella c/ Morango', 'doce', 'Nutella, morangos frescos, granulado de chocolate', 'Sobremesa em forma de pizza', 35.90, 46.90, 59.90, '🍓', true),
  ('Trufa c/ Nozes', 'premium', 'Creme de trufa negra, nozes, gorgonzola, fio de mel', 'A mais sofisticada do cardápio', 45.90, 60.90, 78.90, '🫚', false)
ON CONFLICT DO NOTHING;

-- Clientes de exemplo
INSERT INTO clientes (nome, cpf, telefone, email, endereco, bairro, cep, cidade) VALUES
  ('Carlos Silva', '111.111.111-11', '(11) 98765-4321', 'carlos@email.com', 'Rua das Flores, 100', 'Jardim Paulista', '01310-100', 'São Paulo'),
  ('Ana Costa', '222.222.222-22', '(11) 97654-3210', 'ana@email.com', 'Av. Brasil, 500', 'Centro', '01310-200', 'São Paulo'),
  ('João Ferreira', '333.333.333-33', '(11) 96543-2109', 'joao@email.com', 'Rua São Paulo, 250', 'Vila Madalena', '05434-020', 'São Paulo'),
  ('Maria Oliveira', '444.444.444-44', '(11) 95432-1098', 'maria@email.com', 'Rua Liberdade, 88', 'Liberdade', '01505-000', 'São Paulo'),
  ('Pedro Santos', '555.555.555-55', '(11) 94321-0987', 'pedro@email.com', 'Av. Paulista, 1000', 'Bela Vista', '01310-100', 'São Paulo')
ON CONFLICT (cpf) DO NOTHING;

-- Estoque inicial
INSERT INTO estoque (produto, categoria, unidade, quantidade_atual, quantidade_minima, preco_custo) VALUES
  ('Massa de Pizza', 'Base', 'kg', 80, 20, 3.50),
  ('Molho de Tomate', 'Base', 'L', 45, 15, 5.00),
  ('Mussarela', 'Queijo', 'kg', 35, 10, 28.00),
  ('Pepperoni', 'Carne', 'kg', 12, 8, 45.00),
  ('Calabresa', 'Carne', 'kg', 7, 8, 22.00),
  ('Frango (peito)', 'Carne', 'kg', 25, 10, 18.00),
  ('Catupiry', 'Queijo', 'kg', 18, 5, 32.00),
  ('Gorgonzola', 'Queijo', 'kg', 8, 3, 65.00),
  ('Parmesão', 'Queijo', 'kg', 12, 4, 55.00),
  ('Cheddar', 'Queijo', 'kg', 15, 5, 38.00),
  ('Ovos', 'Outros', 'dz', 10, 3, 15.00),
  ('Caixas P (25cm)', 'Embalagem', 'un', 150, 50, 0.80),
  ('Caixas M (30cm)', 'Embalagem', 'un', 200, 80, 1.00),
  ('Caixas G (35cm)', 'Embalagem', 'un', 3, 50, 1.20),
  ('Lenços', 'Embalagem', 'cx', 20, 5, 8.00),
  ('Farinha de Trigo', 'Base', 'kg', 60, 20, 3.00),
  ('Azeite Extra Virgem', 'Tempero', 'L', 8, 2, 25.00),
  ('Alho', 'Tempero', 'kg', 5, 2, 15.00),
  ('Manjericão Fresco', 'Tempero', 'maço', 10, 3, 4.00),
  ('Nutella', 'Doce', 'kg', 6, 2, 45.00)
ON CONFLICT DO NOTHING;

-- Configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('nome_empresa', 'PizzaMaster Pro', 'Nome da pizzaria'),
  ('cnpj', '00.000.000/0001-00', 'CNPJ da empresa'),
  ('telefone', '(11) 9999-9999', 'Telefone de contato'),
  ('endereco', 'Rua das Pizzas, 123 - São Paulo/SP', 'Endereço da pizzaria'),
  ('taxa_entrega_padrao', '5.00', 'Taxa de entrega padrão em R$'),
  ('raio_entrega_km', '10', 'Raio máximo de entrega em km'),
  ('tempo_estimado_min', '45', 'Tempo estimado de entrega em minutos'),
  ('pedido_minimo', '30.00', 'Valor mínimo do pedido'),
  ('horario_abertura', '17:00', 'Horário de abertura'),
  ('horario_fechamento', '23:30', 'Horário de fechamento'),
  ('aceita_pix', 'true', 'Aceita pagamento por PIX'),
  ('chave_pix', 'pizzamaster@pix.com', 'Chave PIX'),
  ('whatsapp', '(11) 99999-9999', 'WhatsApp para pedidos'),
  ('instagram', '@pizzamasterpro', 'Instagram da pizzaria')
ON CONFLICT (chave) DO NOTHING;

-- ────────────────────────────────────────────────────
-- FUNÇÕES ÚTEIS
-- ────────────────────────────────────────────────────

-- Atualizar total de vendas das pizzas
CREATE OR REPLACE FUNCTION atualizar_vendas_pizza()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pizzas 
  SET vendas_total = vendas_total + NEW.quantidade
  WHERE id = NEW.pizza_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vendas_pizza
AFTER INSERT ON itens_pedido
FOR EACH ROW EXECUTE FUNCTION atualizar_vendas_pizza();

-- Updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pizzas_updated_at BEFORE UPDATE ON pizzas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estoque_updated_at BEFORE UPDATE ON estoque FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
