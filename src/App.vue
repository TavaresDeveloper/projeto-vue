<template>
  <router-view v-if="mostrarLogin" />

  <div class="app" v-if="mostrarApp">
    <!-- Header -->
    <header class="header">
      <div>
        <h1 class="header-title">Mercadinho Pinheirão</h1>
        <p class="header-sub">Painel de vendas e controle de estoque</p>
      </div>
    </header>

    <!-- Métricas -->
    <section class="metrics">
      <div class="metric">
        <div class="metric-label">Produtos</div>
        <div class="metric-value">{{ totalProdutos }}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Clientes</div>
        <div class="metric-value">{{ totalClientes }}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Vendas do mês</div>
        <div class="metric-value metric-mono">{{ fmtMoeda(totalVendas) }}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Ticket médio</div>
        <div class="metric-value">{{ fmtMoeda(ticketMedio) }}</div>
      </div>
    </section>

    <!-- Alertas -->
    <div v-if="alertas.length" class="alerta-bar">
      <span class="alerta-label">
        <svg viewBox="0 0 16 16" fill="none" width="13" height="13" style="display:inline;vertical-align:-2px;margin-right:4px">
          <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M8 6v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Atenção:
      </span>
      <span v-for="a in alertas" :key="a.id" class="alerta-tag">{{ a.nome }} ({{ a.qtd }})</span>
    </div>

    <!-- Tabs -->
    <nav class="tabs">
      <button
        v-for="t in TABS" :key="t.id"
        class="tab"
        :class="{ active: tab === t.id }"
        @click="mudarTab(t.id)"
      >{{ t.label }}</button>
    </nav>

    <!-- Conteúdo das tabs -->
    <main>
      <ViewDashboard
        v-if="tab === 'dashboard'"
        :total-vendas="totalVendas"
        :ticket-medio="ticketMedio"
        :total-clientes="totalClientes"
        :total-itens="totalItensVendidos"
        :unique-produtos="uniqueProdutos"
        :vendas-count="vendasCount"
        :vendas-semana="vendasSemana"
        :vendas-por-categoria="vendasPorCategoria"
        :top-produtos="topProdutos"
      />

      <ViewEstoque
        v-if="tab === 'estoque'"
        :produtos="produtos"
        :carregando="carregandoProdutos"
        :status-produto="statusProduto"
        :status-label="statusLabel"
        :excluir-produto="excluirProduto"
        @editar="abrirEdicao"
      />

      <ViewCadastro
        v-if="tab === 'cadastro'"
        :produto-editando="produtoEditando"
        :adicionar-produto="adicionarProduto"
        :atualizar-produto="atualizarProduto"
        @cancelar="cancelarEdicao"
        @salvo="tab = 'estoque'"
      />

      <ViewMovimentacao
        v-if="tab === 'movimento'"
        :produtos="produtos"
        :clientes="clientes"
        :registrar-movimento="registrarMovimento"
        :ajustar-quantidade="ajustarQuantidade"
      />

      <ViewHistorico
        v-if="tab === 'historico'"
        :movimentos="movimentos"
        :carregando="carregandoMovs"
        :fmt-hora="fmtHora"
      />

      <ViewClientes
        v-if="tab === 'clientes'"
        :clientes="clientes"
        :cliente-editando="clienteEditando"
        :adicionar-cliente="adicionarCliente"
        :atualizar-cliente="atualizarCliente"
        :excluir-cliente="excluirCliente"
        @editar="abrirEdicaoCliente"
        @cancelar="cancelarEdicaoCliente"
        @salvo="clienteEditando = null"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProdutos } from '@/composables/useProdutos'
import { useMovimentos } from '@/composables/useMovimentos'
import { useClientes } from '@/composables/useClientes'
import ViewDashboard from '@/components/ViewDashboard.vue'
import ViewEstoque from '@/components/ViewEstoque.vue'
import ViewCadastro from '@/components/ViewCadastro.vue'
import ViewMovimentacao from '@/components/ViewMovimentacao.vue'
import ViewHistorico from '@/components/ViewHistorico.vue'
import ViewClientes from '@/components/ViewClientes.vue'

const route = useRoute()
const mostrarLogin = computed(() => route.path === '/')
const mostrarApp = computed(() => route.path !== '/')

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'estoque', label: 'Estoque' },
  { id: 'cadastro', label: 'Produtos' },
  { id: 'movimento', label: 'Movimentação' },
  { id: 'historico', label: 'Histórico' },
  { id: 'clientes', label: 'Clientes' }
]

const tab = ref('dashboard')
const produtoEditando = ref(null)
const clienteEditando = ref(null)

const {
  produtos, carregando: carregandoProdutos,
  totalProdutos, totalItens, valorEstoque, semEstoque, estoqueBaixo, alertas,
  statusProduto, statusLabel,
  adicionarProduto, atualizarProduto, excluirProduto, ajustarQuantidade,
  unsub: unsubProd
} = useProdutos()

const {
  movimentos, carregando: carregandoMovs,
  registrarMovimento, fmtHora,
  unsub: unsubMovs
} = useMovimentos()

const {
  clientes, carregando: carregandoClientes,
  totalClientes, adicionarCliente, atualizarCliente, excluirCliente,
  unsub: unsubClientes
} = useClientes()

function getVendaValor(m) {
  const precoVenda = m.valor ?? m.preco ?? produtos.value.find(p => p.id === m.prodId)?.preco ?? 0
  return precoVenda * (m.qty ?? 0)
}

const vendasMensais = computed(() => {
  const hoje = new Date()
  const mes = hoje.getMonth()
  const ano = hoje.getFullYear()

  return movimentos.value.filter(m => {
    if (!m.ts) return false
    return m.tipo === 'saida' && m.ts.getMonth() === mes && m.ts.getFullYear() === ano
  })
})

const totalVendas = computed(() => vendasMensais.value.reduce((acc, m) => acc + getVendaValor(m), 0))
const vendasCount = computed(() => vendasMensais.value.length)
const totalItensVendidos = computed(() => vendasMensais.value.reduce((acc, m) => acc + (m.qty ?? 0), 0))
const ticketMedio = computed(() => vendasCount.value ? totalVendas.value / vendasCount.value : 0)
const uniqueProdutos = computed(() => new Set(vendasMensais.value.map(m => m.prodId)).size)

const vendasPorCategoria = computed(() => {
  const mapa = {}
  vendasMensais.value.forEach(m => {
    const produto = produtos.value.find(p => p.id === m.prodId)
    const categoria = produto?.cat || 'Outros'
    mapa[categoria] = (mapa[categoria] || 0) + getVendaValor(m)
  })
  return Object.entries(mapa)
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5)
})

const topProdutos = computed(() => {
  const mapa = {}
  vendasMensais.value.forEach(m => {
    mapa[m.prodId] = (mapa[m.prodId] || 0) + (m.qty ?? 0)
  })
  return Object.entries(mapa)
    .map(([prodId, qtd]) => {
      const produto = produtos.value.find(p => p.id === prodId)
      return { nome: produto?.nome ?? 'Desconhecido', qtd }
    })
    .sort((a, b) => b.qtd - a.qtd)
    .slice(0, 5)
})

const vendasSemana = computed(() => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const dias = Array.from({ length: 7 }, (_, index) => {
    const dia = new Date(hoje)
    dia.setDate(hoje.getDate() - 6 + index)
    return {
      label: new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(dia),
      date: dia,
      valor: 0
    }
  })

  const mapa = new Map(dias.map(d => [d.date.toDateString(), d]))
  vendasMensais.value.forEach(m => {
    const item = mapa.get(m.ts.toDateString())
    if (item) item.valor += getVendaValor(m)
  })

  const maxValor = Math.max(1, ...dias.map(d => d.valor))
  return dias.map(d => ({ label: d.label, valor: d.valor, pct: Math.round((d.valor / maxValor) * 100) }))
})

onUnmounted(() => { unsubProd(); unsubMovs(); unsubClientes() })

function mudarTab(id) {
  if (id !== 'cadastro') produtoEditando.value = null
  if (id !== 'clientes') clienteEditando.value = null
  tab.value = id
}

function abrirEdicao(produto) {
  produtoEditando.value = produto
  tab.value = 'cadastro'
}

function abrirEdicaoCliente(cliente) {
  clienteEditando.value = cliente
  tab.value = 'clientes'
}

function cancelarEdicao() {
  produtoEditando.value = null
  tab.value = 'estoque'
}

function cancelarEdicaoCliente() {
  clienteEditando.value = null
}

function fmtMoeda(v) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<style>
/* ── Reset & Base ───────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --brand:       #1d6d37;
  --brand-strong:#0f4a2d;
  --brand-light: #e8f5e9;
  --brand-text:  #143d2f;
  --brand-accent: #e0b234;
  --radius-sm:   6px;
  --radius-md:   9px;
  --radius-lg:   16px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 15px;
  color: #1d3224;
  background: radial-gradient(circle at top, #f7fbf5 0%, #edf6ee 55%, #e0e8db 100%);
}

body { background: radial-gradient(circle at top, #f7fbf5 0%, #edf6ee 55%, #e0e8db 100%); min-height: 100vh; }

/* ── Layout ─────────────────────────────────────────── */
.app { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1.2rem 3rem; }

/* ── Header ─────────────────────────────────────────── */
.header { margin-bottom: 1.5rem; }
.header-title { font-size: 22px; font-weight: 600; color: var(--brand); letter-spacing: -0.02em; }
.header-sub   { font-size: 13px; color: #6b6b67; margin-top: 1px; }

/* ── Métricas ───────────────────────────────────────── */
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 1.25rem; }
.metric  { background: #fff; border: 0.5px solid #e0dfd8; border-radius: var(--radius-md); padding: 12px 14px; }
.metric-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 4px; }
.metric-value { font-size: 22px; font-weight: 600; color: #1a1a18; line-height: 1; }
.metric-mono  { font-size: 16px; }
.metric-value.danger  { color: #c0392b; }
.metric-value.warning { color: #b87f0a; }

/* ── Alertas ─────────────────────────────────────────── */
.alerta-bar   { background: #fffbe6; border: 0.5px solid #f0d060; border-radius: var(--radius-md); padding: 9px 14px; margin-bottom: 1.25rem; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.alerta-label { font-size: 12px; font-weight: 600; color: #7a5c00; white-space: nowrap; }
.alerta-tag   { background: #fff; border: 0.5px solid #e8c840; border-radius: 20px; padding: 2px 10px; font-size: 11px; color: #7a5c00; }

/* ── Tabs ───────────────────────────────────────────── */
.tabs { display: flex; gap: 2px; margin-bottom: 1.25rem; border-bottom: 1.5px solid #e0dfd8; }
.tab  { padding: 8px 16px; font-size: 13px; font-weight: 500; background: none; border: none; cursor: pointer; color: #888; border-bottom: 2px solid transparent; margin-bottom: -1.5px; transition: color .12s; }
.tab.active { color: var(--brand); border-bottom-color: var(--brand); }
.tab:hover:not(.active) { color: #333; }

/* ── Inputs globais ─────────────────────────────────── */
.input { padding: 7px 10px; border: 0.5px solid #d0cfc8; border-radius: var(--radius-md); font-size: 13px; background: #fff; color: #1a1a18; font-family: inherit; width: 100%; }
.input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(26,122,74,.12); }
.select-sm { min-width: 140px; width: auto; }

/* ── Buttons ────────────────────────────────────────── */
.btn { padding: 7px 16px; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; cursor: pointer; border: 0.5px solid #d0cfc8; background: transparent; color: #1a1a18; font-family: inherit; transition: background .1s; }
.btn:hover:not(:disabled) { background: #f0efe8; }
.btn:active { transform: scale(.98); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn-primary { background: var(--brand); color: #fff; border-color: transparent; }
.btn-primary:hover:not(:disabled) { background: #155e39; }
.btn-danger  { color: #c0392b; border-color: #f5c6c4; }
.btn-danger:hover { background: #fef2f1; }
.btn-sm { padding: 4px 10px; font-size: 12px; }

/* ── Tabela ─────────────────────────────────────────── */
.table-wrap { background: #fff; border: 0.5px solid #e0dfd8; border-radius: var(--radius-lg); overflow: hidden; }
table  { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
thead th { text-align: left; padding: 9px 10px; font-size: 10px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: .05em; border-bottom: 0.5px solid #e0dfd8; background: #fafaf7; }
tbody td { padding: 10px 10px; border-bottom: 0.5px solid #f0efe8; color: #1a1a18; vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: #fafaf7; }
.nome-cel { font-weight: 500; }
.num   { font-variant-numeric: tabular-nums; }
.muted { color: #888; }
.empty { text-align: center; padding: 2.5rem; color: #aaa; font-size: 14px; }

/* ── Badges ─────────────────────────────────────────── */
.badge     { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.badge-ok  { background: #e8f7ee; color: #1a7a4a; }
.badge-low { background: #fffbe6; color: #7a5c00; }
.badge-out { background: #fef2f1; color: #c0392b; }
.badge-cat { background: #eff0fb; color: #3a42a0; font-size: 10px; }

/* ── Search bar ─────────────────────────────────────── */
.search-bar { display: flex; gap: 10px; margin-bottom: 1rem; flex-wrap: wrap; }
.search-bar .input { flex: 1; min-width: 160px; }
.row-actions { display: flex; gap: 6px; }

/* ── Formulário ─────────────────────────────────────── */
.form-card  { background: #fff; border: 0.5px solid #e0dfd8; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; }
.form-title { font-size: 15px; font-weight: 600; color: #1a1a18; margin-bottom: 1rem; }
.form-grid  { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
.span2 { grid-column: span 2; }
.form-erro  { margin-top: 10px; font-size: 13px; color: #c0392b; }
.form-actions { display: flex; gap: 8px; margin-top: 1rem; flex-wrap: wrap; }

/* ── Movimentos (histórico) ─────────────────────────── */
.movimentos { display: flex; flex-direction: column; gap: 8px; }
.mov-item   { display: flex; align-items: center; gap: 12px; padding: 11px 14px; background: #fff; border: 0.5px solid #e0dfd8; border-radius: var(--radius-md); }
.mov-icon   { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mov-icon.entrada { background: #e8f7ee; color: #1a7a4a; }
.mov-icon.saida   { background: #fef2f1; color: #c0392b; }
.mov-info   { flex: 1; min-width: 0; }
.mov-nome   { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mov-detalhe{ font-size: 11px; color: #888; margin-top: 2px; }
.mov-right  { text-align: right; flex-shrink: 0; }
.mov-qty    { font-size: 14px; font-weight: 600; }
.mov-qty.entrada { color: #1a7a4a; }
.mov-qty.saida   { color: #c0392b; }
.mov-time   { font-size: 11px; color: #aaa; margin-top: 2px; }

/* ── Responsivo ─────────────────────────────────────── */
@media (max-width: 560px) {
  .form-grid { grid-template-columns: 1fr; }
  .span2 { grid-column: span 1; }
  .metrics { grid-template-columns: repeat(2, 1fr); }
}
</style>
