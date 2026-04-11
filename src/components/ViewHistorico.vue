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
          <div class="mov-detalhe">{{ m.obs || '—' }}</div>
        </div>
        <div class="mov-right">
          <div class="mov-qty" :class="m.tipo">
            {{ m.tipo === 'entrada' ? '+' : '-' }}{{ m.qty }}
          </div>
          <div class="mov-time">{{ fmtHora(m.ts) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  movimentos:  { type: Array,    default: () => [] },
  carregando:  { type: Boolean,  default: false },
  fmtHora:     { type: Function, required: true }
})
</script>
