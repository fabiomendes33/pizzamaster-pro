-- =====================================================
-- PIZZAMASTER PRO - DATABASE SCHEMA (PostgreSQL)
-- Versao corrigida - Execute no pgAdmin Query Tool
-- =====================================================

-- PASSO 1: LIMPAR TUDO (se ja existir)
DROP TABLE IF EXISTS movimentacoes_estoque CASCADE;
DROP TABLE IF EXISTS itens_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS estoque CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS pizzas CASCADE;
DROP TABLE IF EXISTS configuracoes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TYPE IF EXISTS categoria_pizza CASCADE;
DROP TYPE IF EXISTS tamanho_pizza CASCADE;
DROP TYPE IF EXISTS status_pedido CASCADE;
DROP TYPE IF EXISTS tipo_pedido CASCADE;
DROP TYPE IF EXISTS forma_pagamento CASCADE;
DROP TYPE IF EXISTS role_usuario CASCADE;
DROP VIEW IF EXISTS v_dashboard CASCADE;
DROP VIEW IF EXISTS v_top_pizzas CASCADE;
DROP FUNCTION IF EXISTS atualizar_vendas_pizza CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- PASSO 2: EXTENSOES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PASSO 3: ENUMS
CREATE TYPE categoria_pizza AS ENUM ('tradicional', 'especial', 'premium', 'doce', 'bebida');
CREATE TYPE tamanho_pizza AS ENUM ('P', 'M', 'G');
CREATE TYPE status_pedido AS ENUM ('recebido', 'preparando', 'entrega', 'entregue', 'cancelado');
CREATE TYPE tipo_pedido AS ENUM ('entrega', 'retirada', 'local');
CREATE TYPE forma_pagamento AS ENUM ('dinheiro', 'credito', 'debito', 'pix', 'vale_refeicao');
CREATE TYPE role_usuario AS ENUM ('admin', 'gerente', 'atendente', 'cozinha', 'entregador');

-- PASSO 4: TABELA USUARIOS
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  senha_hash  TEXT NOT NULL,
  role        role_usuario DEFAULT 'atendente',
  ativo       BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios(email);

-- PASSO 5: TABELA PIZZAS
CREATE TABLE pizzas (
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

CREATE INDEX idx_pizzas_categoria ON pizzas(categoria);
CREATE INDEX idx_pizzas_ativo ON pizzas(ativo);

-- PASSO 6: TABELA CLIENTES
CREATE TABLE clientes (
  id                SERIAL PRIMARY KEY,
  nome              VARCHAR(150) NOT NULL,
  cpf               VARCHAR(14) UNIQUE,
  telefone          VARCHAR(20) NOT NULL,
  email             VARCHAR(150) UNIQUE,
  endereco          TEXT,
  numero            VARCHAR(10),
  complemento       VARCHAR(50),
  bairro            VARCHAR(80),
  cidade            VARCHAR(80) DEFAULT 'Sao Paulo',
  estado            VARCHAR(2) DEFAULT 'SP',
  cep               VARCHAR(9),
  data_nascimento   DATE,
  observacoes       TEXT,
  pontos_fidelidade INT DEFAULT 0,
  ativo             BOOLEAN DEFAULT true,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_clientes_telefone ON clientes(telefone);

-- PASSO 7: TABELA PEDIDOS
CREATE TABLE pedidos (
  id                    SERIAL PRIMARY KEY,
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

CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_data ON pedidos(created_at);

-- PASSO 8: TABELA ITENS DO PEDIDO
CREATE TABLE itens_pedido (
  id          SERIAL PRIMARY KEY,
  pedido_id   INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  pizza_id    INT NOT NULL REFERENCES pizzas(id),
  tamanho     tamanho_pizza NOT NULL,
  quantidade  INT NOT NULL DEFAULT 1,
  preco_unit  NUMERIC(10, 2) NOT NULL,
  preco_total NUMERIC(10, 2) NOT NULL,
  observacoes TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_itens_pedido ON itens_pedido(pedido_id);

-- PASSO 9: TABELA ESTOQUE
CREATE TABLE estoque (
  id                SERIAL PRIMARY KEY,
  produto           VARCHAR(150) NOT NULL,
  categoria         VARCHAR(80),
  unidade           VARCHAR(20) DEFAULT 'kg',
  quantidade_atual  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  quantidade_minima NUMERIC(10, 2) NOT NULL DEFAULT 0,
  preco_custo       NUMERIC(10, 2) DEFAULT 0,
  fornecedor        VARCHAR(100),
  observacoes       TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- PASSO 10: TABELA MOVIMENTACOES ESTOQUE
CREATE TABLE movimentacoes_estoque (
  id          SERIAL PRIMARY KEY,
  estoque_id  INT NOT NULL REFERENCES estoque(id),
  tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste')),
  quantidade  NUMERIC(10, 2) NOT NULL,
  usuario_id  INT REFERENCES usuarios(id),
  pedido_id   INT REFERENCES pedidos(id),
  observacao  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- PASSO 11: TABELA CONFIGURACOES
CREATE TABLE configuracoes (
  id         SERIAL PRIMARY KEY,
  chave      VARCHAR(100) UNIQUE NOT NULL,
  valor      TEXT,
  descricao  TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PASSO 12: VIEWS
CREATE OR REPLACE VIEW v_dashboard AS
SELECT
  (SELECT COUNT(*) FROM pedidos WHERE DATE(created_at) = CURRENT_DATE AND status != 'cancelado') AS pedidos_hoje,
  (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE DATE(created_at) = CURRENT_DATE AND status != 'cancelado') AS faturamento_hoje,
  (SELECT COUNT(*) FROM clientes WHERE ativo = true) AS total_clientes,
  (SELECT COUNT(*) FROM pedidos WHERE status = 'recebido') AS pedidos_recebidos,
  (SELECT COUNT(*) FROM pedidos WHERE status = 'preparando') AS pedidos_preparando,
  (SELECT COUNT(*) FROM pedidos WHERE status = 'entrega') AS pedidos_entrega,
  (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW()) AND status != 'cancelado') AS faturamento_mes;

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

-- PASSO 13: FUNCOES E TRIGGERS
CREATE OR REPLACE FUNCTION atualizar_vendas_pizza()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pizzas SET vendas_total = vendas_total + NEW.quantidade WHERE id = NEW.pizza_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vendas_pizza
AFTER INSERT ON itens_pedido
FOR EACH ROW EXECUTE FUNCTION atualizar_vendas_pizza();

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

-- PASSO 14: DADOS INICIAIS

-- Usuarios (senha padrao: admin123)
INSERT INTO usuarios (nome, email, senha_hash, role) VALUES
  ('Administrador', 'admin@pizzamaster.com', '$2a$10$rBnNKmHGXgJqkBnMX5h2Au8VJZLPFGt9EK3PGBQHhbOiEH1pMJGH2', 'admin'),
  ('Gerente', 'gerente@pizzamaster.com', '$2a$10$rBnNKmHGXgJqkBnMX5h2Au8VJZLPFGt9EK3PGBQHhbOiEH1pMJGH2', 'gerente'),
  ('Atendente', 'atendente@pizzamaster.com', '$2a$10$rBnNKmHGXgJqkBnMX5h2Au8VJZLPFGt9EK3PGBQHhbOiEH1pMJGH2', 'atendente');

-- Cardapio de pizzas
INSERT INTO pizzas (nome, categoria, ingredientes, preco_p, preco_m, preco_g, emoji, destaque) VALUES
  ('Margherita', 'tradicional', 'Molho de tomate, mussarela, manjericao fresco', 29.90, 39.90, 49.90, '🍕', true),
  ('Pepperoni', 'especial', 'Pepperoni artesanal, mussarela, molho de tomate', 34.90, 44.90, 59.90, '🍕', true),
  ('Quatro Queijos', 'especial', 'Mussarela, cheddar, parmesao, gorgonzola', 36.90, 48.90, 62.90, '🧀', false),
  ('Portuguesa', 'tradicional', 'Presunto, ovo, cebola, azeitona, mussarela', 32.90, 42.90, 55.90, '🍳', false),
  ('Frango c/ Catupiry', 'especial', 'Frango desfiado temperado, catupiry, milho', 33.90, 44.90, 58.90, '🐔', true),
  ('Calabresa', 'tradicional', 'Calabresa artesanal, cebola, azeitona, mussarela', 30.90, 40.90, 52.90, '🌶️', false),
  ('Napolitana', 'tradicional', 'Tomate fresco, mussarela, alho, manjericao', 31.90, 41.90, 53.90, '🍅', false),
  ('Strogonoff de Carne', 'premium', 'Strogonoff de carne bovina, mussarela, batata palha', 39.90, 52.90, 68.90, '🥩', true),
  ('Mexicana', 'premium', 'Carne moida, jalapeno, pimenta, queijo gouda', 38.90, 51.90, 66.90, '🌮', false),
  ('Banana Nevada', 'doce', 'Banana fatiada, acucar, canela, mussarela', 28.90, 38.90, 48.90, '🍌', false),
  ('Nutella c/ Morango', 'doce', 'Nutella, morangos frescos, granulado de chocolate', 35.90, 46.90, 59.90, '🍓', true),
  ('Trufa c/ Nozes', 'premium', 'Creme de trufa, nozes, gorgonzola, fio de mel', 45.90, 60.90, 78.90, '🍄', false);

-- Clientes de exemplo
INSERT INTO clientes (nome, cpf, telefone, email, endereco, bairro, cidade) VALUES
  ('Carlos Silva', '111.111.111-11', '(11) 98765-4321', 'carlos@email.com', 'Rua das Flores, 100', 'Jardins', 'Sao Paulo'),
  ('Ana Costa', '222.222.222-22', '(11) 97654-3210', 'ana@email.com', 'Av. Brasil, 500', 'Centro', 'Sao Paulo'),
  ('Joao Ferreira', '333.333.333-33', '(11) 96543-2109', 'joao@email.com', 'Rua Sao Paulo, 250', 'Vila Madalena', 'Sao Paulo'),
  ('Maria Oliveira', '444.444.444-44', '(11) 95432-1098', 'maria@email.com', 'Rua Liberdade, 88', 'Liberdade', 'Sao Paulo'),
  ('Pedro Santos', '555.555.555-55', '(11) 94321-0987', 'pedro@email.com', 'Av. Paulista, 1000', 'Bela Vista', 'Sao Paulo');

-- Estoque inicial
INSERT INTO estoque (produto, categoria, unidade, quantidade_atual, quantidade_minima, preco_custo) VALUES
  ('Massa de Pizza', 'Base', 'kg', 80, 20, 3.50),
  ('Molho de Tomate', 'Base', 'L', 45, 15, 5.00),
  ('Mussarela', 'Queijo', 'kg', 35, 10, 28.00),
  ('Pepperoni', 'Carne', 'kg', 12, 8, 45.00),
  ('Calabresa', 'Carne', 'kg', 7, 8, 22.00),
  ('Frango', 'Carne', 'kg', 25, 10, 18.00),
  ('Catupiry', 'Queijo', 'kg', 18, 5, 32.00),
  ('Gorgonzola', 'Queijo', 'kg', 8, 3, 65.00),
  ('Parmesao', 'Queijo', 'kg', 12, 4, 55.00),
  ('Cheddar', 'Queijo', 'kg', 15, 5, 38.00),
  ('Ovos', 'Outros', 'dz', 10, 3, 15.00),
  ('Caixas P 25cm', 'Embalagem', 'un', 150, 50, 0.80),
  ('Caixas M 30cm', 'Embalagem', 'un', 200, 80, 1.00),
  ('Caixas G 35cm', 'Embalagem', 'un', 3, 50, 1.20),
  ('Farinha de Trigo', 'Base', 'kg', 60, 20, 3.00),
  ('Azeite', 'Tempero', 'L', 8, 2, 25.00),
  ('Alho', 'Tempero', 'kg', 5, 2, 15.00),
  ('Manjericao', 'Tempero', 'maco', 10, 3, 4.00),
  ('Nutella', 'Doce', 'kg', 6, 2, 45.00),
  ('Lencos', 'Embalagem', 'cx', 20, 5, 8.00);

-- Configuracoes do sistema
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('nome_empresa', 'PizzaMaster Pro', 'Nome da pizzaria'),
  ('cnpj', '00.000.000/0001-00', 'CNPJ da empresa'),
  ('telefone', '(11) 9999-9999', 'Telefone de contato'),
  ('endereco', 'Rua das Pizzas, 123 - Sao Paulo/SP', 'Endereco da pizzaria'),
  ('taxa_entrega_padrao', '5.00', 'Taxa de entrega em R$'),
  ('raio_entrega_km', '10', 'Raio maximo de entrega em km'),
  ('tempo_estimado_min', '45', 'Tempo estimado de entrega em minutos'),
  ('pedido_minimo', '30.00', 'Valor minimo do pedido'),
  ('horario_abertura', '17:00', 'Horario de abertura'),
  ('horario_fechamento', '23:30', 'Horario de fechamento'),
  ('aceita_pix', 'true', 'Aceita pagamento por PIX'),
  ('whatsapp', '(11) 99999-9999', 'WhatsApp para pedidos'),
  ('instagram', '@pizzamasterpro', 'Instagram da pizzaria');

-- FIM DO SCRIPT
-- Verifique as tabelas criadas:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
