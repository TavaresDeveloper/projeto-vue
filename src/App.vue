<template>
  <router-view v-if="mostrarLogin" />

  <div class="app" v-if="mostrarApp">
    <!-- Header -->
    <header class="header">
      <div class="header-brand">
        <span class="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h18" />
            <path d="M12 3v18" />
            <path d="M7.5 7.5l9 9" />
            <path d="M16.5 7.5l-9 9" />
          </svg>
        </span>
        <div>
          <h1 class="header-title">Mercadinho Pinheirão</h1>
          <p class="header-sub">Painel de vendas e controle de estoque</p>
        </div>
      </div>
      <div class="header-actions">
        <span v-if="user">Usuário: {{ userEmail }}</span>
        <button v-if="user" class="logout-button" @click="logout">Sair</button>
      </div>
    </header>

    <!-- Métricas -->
    <section class="metrics">
      <div class="metric">
        <div class="metric-top">
          <span class="metric-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 7h16v10H4z" />
              <path d="M4 7l8 5 8-5" />
            </svg>
          </span>
          <div class="metric-label">Produtos</div>
        </div>
        <div class="metric-value">{{ totalProdutos }}</div>
      </div>
      <div class="metric">
        <div class="metric-top">
          <span class="metric-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 7a4 4 0 1 1 8 0" />
              <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
            </svg>
          </span>
          <div class="metric-label">Clientes</div>
        </div>
        <div class="metric-value">{{ totalClientes }}</div>
      </div>
      <div class="metric">
        <div class="metric-top">
          <span class="metric-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 17l6-6 4 4 6-8" />
              <path d="M4 21h16" />
            </svg>
          </span>
          <div class="metric-label">Vendas do mês</div>
        </div>
        <div class="metric-value metric-mono">{{ fmtMoeda(totalVendas) }}</div>
      </div>
      <div class="metric">
        <div class="metric-top">
          <span class="metric-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 17a8 8 0 1 1 12 0" />
              <path d="M12 9v3" />
              <path d="M12 14h2" />
            </svg>
          </span>
          <div class="metric-label">Ticket médio</div>
        </div>
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
import { ref, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase.js'
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
const router = useRouter()
const user = ref(null)
const authReady = ref(false)

const mostrarLogin = computed(() => route.path === '/')
const mostrarApp = computed(() => authReady.value && route.path !== '/' && !!user.value)

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser
  authReady.value = true

  if (!currentUser && route.path !== '/') {
    router.push('/')
  }
  if (currentUser && route.path === '/') {
    router.push('/estoque')
  }
})

watch(route, (to) => {
  if (!authReady.value) return
  if (!user.value && to.path !== '/') {
    router.push('/')
  }
  if (user.value && to.path === '/') {
    router.push('/estoque')
  }
})

const userEmail = computed(() => user.value?.email || 'Deslogado')

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

function logout() {
  signOut(auth)
    .then(() => {
      router.push('/')
    })
}

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
  --bg:           #050c16;
  --surface:      rgba(7, 14, 28, 0.96);
  --surface-soft: #071423;
  --surface-strong:#0b1c31;
  --text:         #e4f8ff;
  --muted:        #8bb7d8;
  --brand:        #45d1ff;
  --brand-strong: #07a8f2;
  --border:       rgba(69, 209, 255, 0.2);
  --shadow:       0 24px 60px rgba(0, 0, 0, 0.22);
  --radius-sm:    10px;
  --radius-md:    16px;
  --radius-lg:    24px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 15px;
  color: var(--text);
  background: radial-gradient(circle at top, #08111e 0%, #02050d 70%, #000000 100%);
}

body {
  background: radial-gradient(circle at top, #08111e 0%, #02050d 72%, #000000 100%);
  color: var(--text);
  min-height: 100vh;
}

button, input, select, textarea { font: inherit; }

/* ── Layout ─────────────────────────────────────────── */
.app { max-width: 1160px; margin: 0 auto; padding: 1.8rem 1.4rem 3rem; }

/* ── Header ─────────────────────────────────────────── */
.header {
  margin-bottom: 1.8rem;
  padding: 1.15rem 1.25rem;
  border: 1px solid rgba(69, 209, 255, 0.12);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(7, 16, 32, 0.86), rgba(6, 12, 22, 0.94));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.header-brand { display: flex; align-items: center; gap: 0.9rem; }
.brand-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(69, 209, 255, 0.16);
  color: #8bf1ff;
}
.header-title { font-size: 24px; font-weight: 700; color: #dff8ff; letter-spacing: -0.04em; }
.header-sub   { font-size: 13px; color: rgba(228, 248, 255, 0.72); margin-top: 4px; }
.header-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: flex-end; }
.logout-button { border: 1px solid rgba(69, 209, 255, 0.45); background: rgba(69, 209, 255, 0.08); color: var(--text); }

.metric-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.metric-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(69, 209, 255, 0.14);
  color: #d8f7ff;
}
.metric-icon svg { width: 18px; height: 18px; }

/* ── Métricas ───────────────────────────────────────── */
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 1.45rem; }
.metric {
  background: linear-gradient(180deg, rgba(10, 20, 37, 0.96), rgba(3, 7, 16, 0.95));
  border: 1px solid rgba(69, 209, 255, 0.12);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
}
.metric-label { font-size: 11px; color: rgba(228, 248, 255, 0.62); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
.metric-value { font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1; }
.metric-mono { font-size: 16px; letter-spacing: 0.01em; }
.metric-value.danger { color: #fb6a6a; }
.metric-value.warning { color: #f2bf4f; }

/* ── Alertas ─────────────────────────────────────────── */
.alerta-bar {
  background: rgba(6, 17, 34, 0.9);
  border: 1px solid rgba(69, 209, 255, 0.14);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  margin-bottom: 1.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.alerta-label { font-size: 12px; font-weight: 700; color: #8fdcff; white-space: nowrap; }
.alerta-tag { background: rgba(69, 209, 255, 0.08); border: 1px solid rgba(69, 209, 255, 0.16); border-radius: 999px; padding: 4px 12px; font-size: 11px; color: #b8f0ff; }

/* ── Tabs ───────────────────────────────────────────── */
.tabs { display: flex; gap: 4px; margin-bottom: 1.45rem; border-bottom: 1px solid rgba(69, 209, 255, 0.16); }
.tab {
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(228, 248, 255, 0.72);
  border-bottom: 2px solid transparent;
  transition: color .18s, border-color .18s, transform .18s;
}
.tab.active {
  color: #ffffff;
  border-bottom-color: var(--brand);
}
.tab:hover:not(.active) { color: #cbeeff; transform: translateY(-1px); }

/* ── Inputs globais ─────────────────────────────────── */
.input {
  padding: 10px 12px;
  border: 1px solid rgba(69, 209, 255, 0.18);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: rgba(7, 18, 34, 0.95);
  color: var(--text);
  font-family: inherit;
  width: 100%;
}
.input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(69, 209, 255, .14); }
.select-sm { min-width: 140px; width: auto; }

/* ── Buttons ────────────────────────────────────────── */
.btn {
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid rgba(69, 209, 255, 0.2);
  background: rgba(5, 10, 22, 0.92);
  color: var(--text);
  font-family: inherit;
  transition: background .18s, transform .18s, border-color .18s;
}
.btn:hover:not(:disabled) { background: rgba(69, 209, 255, 0.12); border-color: rgba(69, 209, 255, 0.4); }
.btn:active { transform: scale(.98); }
.btn:disabled { opacity: .55; cursor: not-allowed; }
.btn-primary { background: linear-gradient(135deg, rgba(69,209,255,0.9), rgba(11,124,205,0.95)); color: #fff; border-color: transparent; }
.btn-primary:hover:not(:disabled) { background: linear-gradient(135deg, rgba(69,209,255,1), rgba(11,124,205,1)); }
.btn-danger { color: #ff8f94; border-color: rgba(255, 143, 148, 0.25); }
.btn-danger:hover { background: rgba(255, 143, 148, 0.12); }
.btn-sm { padding: 6px 12px; font-size: 12px; }

/* ── Tabela ─────────────────────────────────────────── */
.table-wrap { background: rgba(8, 17, 30, 0.98); border: 1px solid rgba(69, 209, 255, 0.16); border-radius: var(--radius-lg); overflow: hidden; }
table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
thead th {
  text-align: left;
  padding: 12px 14px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(228, 248, 255, 0.72);
  text-transform: uppercase;
  letter-spacing: .08em;
  border-bottom: 1px solid rgba(69, 209, 255, 0.14);
  background: rgba(6, 14, 25, 0.9);
}
tbody td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(69, 209, 255, 0.08);
  color: rgba(228, 248, 255, 0.88);
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: rgba(69, 209, 255, 0.04); }
.nome-cel { font-weight: 600; color: #f5fbff; }
.num { font-variant-numeric: tabular-nums; }
.muted { color: rgba(228, 248, 255, 0.62); }
.empty { text-align: center; padding: 2.5rem; color: rgba(228, 248, 255, 0.6); font-size: 14px; }

/* ── Badges ─────────────────────────────────────────── */
.badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.badge-ok { background: rgba(67, 220, 255, 0.12); color: #8ef0ff; }
.badge-low { background: rgba(214, 181, 70, 0.12); color: #ffd46d; }
.badge-out { background: rgba(255, 105, 105, 0.12); color: #ffb3b5; }
.badge-cat { background: rgba(128, 142, 255, 0.14); color: #c8d8ff; font-size: 10px; }

/* ── Search bar ─────────────────────────────────────── */
.search-bar { display: flex; gap: 10px; margin-bottom: 1rem; flex-wrap: wrap; }
.search-bar .input { flex: 1; min-width: 160px; }
.row-actions { display: flex; gap: 6px; }

/* ── Formulário ─────────────────────────────────────── */
.form-card {
  background: linear-gradient(180deg, rgba(7, 14, 30, 0.94), rgba(5, 9, 19, 0.98));
  border: 1px solid rgba(69, 209, 255, 0.16);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.6rem;
}
.form-title { font-size: 16px; font-weight: 700; color: #f7fdff; margin-bottom: 1rem; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 11px; color: rgba(228, 248, 255, 0.68); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.span2 { grid-column: span 2; }
.form-erro { margin-top: 10px; font-size: 13px; color: #ff8080; }
.form-actions { display: flex; gap: 10px; margin-top: 1rem; flex-wrap: wrap; }

/* ── Movimentos (histórico) ─────────────────────────── */
.movimentos { display: flex; flex-direction: column; gap: 10px; }
.mov-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(7, 17, 30, 0.95);
  border: 1px solid rgba(69, 209, 255, 0.12);
  border-radius: var(--radius-md);
}
.mov-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mov-icon.entrada { background: rgba(67, 220, 255, 0.14); color: #9de7ff; }
.mov-icon.saida { background: rgba(255, 131, 131, 0.14); color: #ffbfbf; }
.mov-info { flex: 1; min-width: 0; }
.mov-nome { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #e7f7ff; }
.mov-detalhe { font-size: 11px; color: rgba(228, 248, 255, 0.62); margin-top: 3px; }
.mov-right { text-align: right; flex-shrink: 0; }
.mov-qty { font-size: 14px; font-weight: 700; }
.mov-qty.entrada { color: #8fffdc; }
.mov-qty.saida { color: #ff9aa6; }
.mov-time { font-size: 11px; color: rgba(228, 248, 255, 0.55); margin-top: 2px; }

/* ── Responsivo ─────────────────────────────────────── */
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .span2 { grid-column: span 1; }
  .metrics { grid-template-columns: repeat(2, 1fr); }
}
</style>
