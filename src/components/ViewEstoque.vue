<template>
  <div>
    <!-- Barra de busca e filtros -->
    <div class="search-bar">
      <input
        v-model="busca"
        type="text"
        placeholder="Buscar produto..."
        class="input"
      />
      <select v-model="filtCat" class="input select-sm">
        <option value="">Todas categorias</option>
        <option v-for="c in CATEGORIAS" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="filtStatus" class="input select-sm">
        <option value="">Todos status</option>
        <option value="ok">Normal</option>
        <option value="low">Estoque baixo</option>
        <option value="out">Sem estoque</option>
      </select>
    </div>

    <!-- Tabela -->
    <div class="table-wrap">
      <div v-if="carregando" class="empty">Carregando produtos...</div>
      <table v-else>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Custo</th>
            <th>Qtd.</th>
            <th>Mín.</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="prodsFiltrados.length === 0">
            <td colspan="8" class="empty">Nenhum produto encontrado.</td>
          </tr>
          <tr v-for="p in prodsFiltrados" :key="p.id">
            <td class="nome-cel">{{ p.nome }}</td>
            <td><span class="badge badge-cat">{{ p.cat }}</span></td>
            <td>{{ fmtMoeda(p.preco) }}</td>
            <td class="muted">{{ fmtMoeda(p.custo) }}</td>
            <td class="num">{{ p.qtd }}</td>
            <td class="num muted">{{ p.min }}</td>
            <td>
              <span class="badge" :class="'badge-' + statusProduto(p)">
                {{ statusLabel(p) }}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button class="btn btn-sm" @click="$emit('editar', p)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="confirmarExclusao(p)">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CATEGORIAS } from '@/composables/useProdutos'

const props = defineProps({
  produtos:      { type: Array,   default: () => [] },
  carregando:    { type: Boolean, default: false },
  statusProduto: { type: Function, required: true },
  statusLabel:   { type: Function, required: true },
  excluirProduto:{ type: Function, required: true }
})
const emit = defineEmits(['editar'])

const busca      = ref('')
const filtCat    = ref('')
const filtStatus = ref('')

const prodsFiltrados = computed(() => {
  return props.produtos.filter(p => {
    const okBusca  = !busca.value    || p.nome.toLowerCase().includes(busca.value.toLowerCase())
    const okCat    = !filtCat.value  || p.cat === filtCat.value
    const okStatus = !filtStatus.value || props.statusProduto(p) === filtStatus.value
    return okBusca && okCat && okStatus
  })
})

function fmtMoeda(v) {
  return Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function confirmarExclusao(p) {
  if (confirm(`Excluir "${p.nome}"?`)) {
    await props.excluirProduto(p.id)
  }
}
</script>
