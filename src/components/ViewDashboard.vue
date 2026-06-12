<template>
  <div class="dashboard-grid">
    <div class="dash-card accent-green">
      <div class="card-top">
        <span>Vendas do mês</span>
        <strong>{{ fmtMoeda(totalVendas) }}</strong>
      </div>
      <p>{{ vendasCount }} vendas registradas</p>
    </div>

    <div class="dash-card accent-yellow">
      <div class="card-top">
        <span>Ticket médio</span>
        <strong>{{ fmtMoeda(ticketMedio) }}</strong>
      </div>
      <p>{{ totalVendas }} reais em vendas</p>
    </div>

    <div class="dash-card accent-white">
      <div class="card-top">
        <span>Clientes cadastrados</span>
        <strong>{{ totalClientes }}</strong>
      </div>
      <p>Base de clientes ativa</p>
    </div>

    <div class="dash-card accent-white">
      <div class="card-top">
        <span>Produtos vendidos</span>
        <strong>{{ totalItens }}</strong>
      </div>
      <p>{{ uniqueProdutos }} produtos diferentes</p>
    </div>
  </div>

  <section class="chart-panel">
    <div class="chart-header">
      <h2>Receita semanal</h2>
      <span>{{ mesAtual }}</span>
    </div>
    <div class="chart-bars">
      <div
        v-for="item in vendasSemana"
        :key="item.label"
        class="chart-bar"
      >
        <div class="bar-bg">
          <div class="bar-fill" :style="{ height: item.pct + '%' }"></div>
        </div>
        <strong>{{ item.label }}</strong>
        <span>{{ fmtMoeda(item.valor) }}</span>
      </div>
    </div>
  </section>

  <section class="overview-panel">
    <div class="overview-card">
      <h3>Vendas por categoria</h3>
      <ul>
        <li v-for="cat in vendasPorCategoria" :key="cat.categoria">
          <span>{{ cat.categoria }}</span>
          <strong>{{ fmtMoeda(cat.valor) }}</strong>
        </li>
      </ul>
    </div>
    <div class="overview-card">
      <h3>Top produtos</h3>
      <ul>
        <li v-for="item in topProdutos" :key="item.nome">
          <span>{{ item.nome }}</span>
          <strong>{{ item.qtd }} unidades</strong>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  totalVendas:      { type: Number, default: 0 },
  ticketMedio:      { type: Number, default: 0 },
  totalClientes:    { type: Number, default: 0 },
  totalItens:       { type: Number, default: 0 },
  uniqueProdutos:   { type: Number, default: 0 },
  vendasCount:      { type: Number, default: 0 },
  vendasSemana:     { type: Array,  default: () => [] },
  vendasPorCategoria: { type: Array, default: () => [] },
  topProdutos:      { type: Array,  default: () => [] }
})

function fmtMoeda(v) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const mesAtual = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 1.5rem;
}
.dash-card {
  padding: 18px;
  border-radius: 18px;
  min-height: 130px;
  background: #fff;
  box-shadow: 0 18px 30px rgba(15, 27, 13, 0.08);
  color: #1f3f2a;
}
.card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.card-top span {
  font-size: 0.92rem;
  color: #5a6e5c;
}
.card-top strong {
  font-size: 1.5rem;
}
.dash-card p {
  font-size: 0.94rem;
  color: #5a6e5c;
}
.accent-green { border-left: 6px solid #1f6e44; }
.accent-yellow { border-left: 6px solid #d49b1c; }
.accent-white { background: #fcfdf8; }

.chart-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 18px 26px rgba(18, 34, 18, 0.06);
  padding: 22px;
  margin-bottom: 1.5rem;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.chart-header h2 {
  margin: 0;
  font-size: 1.15rem;
  color: #193d26;
}
.chart-header span {
  color: #5d785d;
  font-size: 0.92rem;
}
.chart-bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 14px;
}
.chart-bar {
  display: grid;
  gap: 10px;
  align-items: end;
  text-align: center;
}
.bar-bg {
  border-radius: 16px;
  overflow: hidden;
  height: 180px;
  background: #f2f6f0;
  display: flex;
  align-items: flex-end;
}
.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, rgba(29,123,61,0.15) 0%, rgba(29,123,61,0.95) 100%);
  border-radius: 16px 16px 0 0;
}
.chart-bar strong,
.chart-bar span {
  font-size: 0.87rem;
  color: #3e5c44;
}

.overview-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.overview-card {
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 18px 26px rgba(18, 34, 18, 0.06);
}
.overview-card h3 {
  margin: 0 0 12px;
  font-size: 1rem;
  color: #233b28;
}
.overview-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.overview-card li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eef3ea;
}
.overview-card li:last-child {
  border-bottom: none;
}
.overview-card span { color: #576f58; }
.overview-card strong { color: #1f4429; }

@media(max-width: 720px) {
  .overview-panel { grid-template-columns: 1fr; }
}
</style>
