<template>
  <div class="form-card">
    <div class="form-title">{{ editando ? 'Editar produto' : 'Novo produto' }}</div>

    <div class="form-grid">
      <div class="form-group span2">
        <label>Nome do produto *</label>
        <input v-model="form.nome" type="text" class="input" placeholder="Ex: Arroz Branco 5kg" />
      </div>
      <div class="form-group">
        <label>Categoria</label>
        <select v-model="form.cat" class="input">
          <option v-for="c in CATEGORIAS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Preço de venda (R$) *</label>
        <input v-model="form.preco" type="number" min="0" step="0.01" class="input" placeholder="0,00" />
      </div>
      <div class="form-group">
        <label>Custo unitário (R$)</label>
        <input v-model="form.custo" type="number" min="0" step="0.01" class="input" placeholder="0,00" />
      </div>
      <div class="form-group">
        <label>Quantidade {{ editando ? 'atual' : 'inicial' }} *</label>
        <input v-model="form.qtd" type="number" min="0" class="input" placeholder="0" />
      </div>
      <div class="form-group">
        <label>Qtd. mínima (alerta)</label>
        <input v-model="form.min" type="number" min="0" class="input" placeholder="5" />
      </div>
    </div>

    <p v-if="erro" class="form-erro">{{ erro }}</p>

    <div class="form-actions">
      <button class="btn btn-primary" :disabled="salvando" @click="salvar">
        {{ salvando ? 'Salvando...' : (editando ? 'Salvar alterações' : 'Cadastrar produto') }}
      </button>
      <button v-if="editando" class="btn" @click="$emit('cancelar')">Cancelar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CATEGORIAS } from '@/composables/useProdutos'

const props = defineProps({
  produtoEditando:    { type: Object,   default: null },
  adicionarProduto:   { type: Function, required: true },
  atualizarProduto:   { type: Function, required: true }
})
const emit = defineEmits(['cancelar', 'salvo'])

const editando = ref(false)
const salvando = ref(false)
const erro     = ref('')

const form = ref(novoForm())

function novoForm() {
  return { nome: '', cat: 'Alimentos', preco: '', custo: '', qtd: '', min: '5' }
}

watch(() => props.produtoEditando, p => {
  if (p) {
    editando.value = true
    form.value = { nome: p.nome, cat: p.cat, preco: String(p.preco), custo: String(p.custo), qtd: String(p.qtd), min: String(p.min) }
  } else {
    editando.value = false
    form.value = novoForm()
  }
}, { immediate: true })

async function salvar() {
  erro.value = ''
  if (!form.value.nome.trim())                          { erro.value = 'Informe o nome do produto.'; return }
  if (isNaN(+form.value.preco) || +form.value.preco < 0) { erro.value = 'Preço de venda inválido.';   return }
  if (isNaN(+form.value.qtd)   || +form.value.qtd   < 0) { erro.value = 'Quantidade inválida.';        return }

  salvando.value = true
  try {
    const dados = {
      nome:  form.value.nome.trim(),
      cat:   form.value.cat,
      preco: +form.value.preco,
      custo: +(form.value.custo || 0),
      qtd:   +form.value.qtd,
      min:   +(form.value.min   || 0)
    }
    if (editando.value) {
      await props.atualizarProduto(props.produtoEditando.id, dados)
    } else {
      await props.adicionarProduto(dados)
    }
    form.value = novoForm()
    emit('salvo')
  } catch (e) {
    erro.value = 'Erro ao salvar: ' + e.message
  } finally {
    salvando.value = false
  }
}
</script>
