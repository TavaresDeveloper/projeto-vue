<template>
  <div>
    <div v-if="carregando" class="empty">Carregando histórico...</div>
    <div v-else-if="movimentos.length === 0" class="table-wrap">
      <div class="empty">Nenhuma movimentação registrada ainda.</div>
    </div>
    <div v-else class="movimentos">
      <div v-for="m in movimentos" :key="m.id" class="mov-item">
        <div class="mov-icon" :class="m.tipo">
          <svg v-if="m.tipo === 'entrada'" viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M8 3v10M3 8l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M8 13V3M3 8l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="mov-info">
          <div class="mov-nome">{{ m.prodNome }}</div>
          <div class="mov-detalhe">
            {{ m.obs || '—' }}
            <span v-if="m.clienteNome" class="mov-client">Cliente: {{ m.clienteNome }}</span>
          </div>
        </div>
        <div class="mov-right">
          <div class="mov-qty" :class="m.tipo">
            {{ m.tipo === 'entrada' ? '+' : '-' }}{{ m.qty }}
          </div>
          <div>
            <div class="mov-valor">{{ formatter(m.valor ?? (m.preco ? m.preco * m.qty : 0)) }}</div>
            <div class="mov-time">{{ fmtHora(m.ts) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movimentos:  { type: Array,    default: () => [] },
  carregando:  { type: Boolean,  default: false },
  fmtHora:     { type: Function, required: true }
})

function formatter(value) {
  return Number(value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<style scoped>
.movimentos {
  display: grid;
  gap: 12px;
}
.mov-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(18, 34, 18, 0.06);
}
.mov-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #edf6ef;
  color: #1f5d34;
}
.mov-icon.entrada { background: #e5f5e6; color: #1c7a3b; }
.mov-icon.saida   { background: #fcebe7; color: #af3d2f; }
.mov-info {
  display: grid;
  gap: 6px;
}
.mov-nome {
  font-weight: 700;
  color: #1c3e2a;
}
.mov-detalhe {
  color: #5c705d;
  font-size: 0.92rem;
  display: grid;
  gap: 4px;
}
.mov-client {
  display: inline-block;
  color: #4f6b55;
  font-size: 0.9rem;
}
.mov-right {
  display: grid;
  gap: 6px;
  text-align: right;
}
.mov-qty {
  font-weight: 700;
}
.mov-qty.entrada { color: #1b6d3d; }
.mov-qty.saida   { color: #b92f2f; }
.mov-valor {
  font-weight: 700;
  color: #163f2b;
}
.mov-time {
  font-size: 0.82rem;
  color: #6a7e6a;
}
</style>
