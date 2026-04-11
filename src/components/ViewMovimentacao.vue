<template>
  <div class="form-card">
    <div class="form-title">Registrar movimentação</div>

    <div class="form-grid">
      <div class="form-group span2">
        <label>Produto *</label>
        <select v-model="form.prodId" class="input">
          <option value="">Selecione...</option>
          <option v-for="p in produtos" :key="p.id" :value="p.id">
            {{ p.nome }} — {{ p.qtd }} em estoque
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Tipo</label>
        <select v-model="form.tipo" class="input">
          <option value="entrada">Entrada (reposição)</option>
          <option value="saida">Saída (venda / perda)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Quantidade *</label>
        <input v-model="form.qty" type="number" min="1" class="input" placeholder="0" />
      </div>
      <div class="form-group span2">
        <label>Observação</label>
        <input v-model="form.obs" type="text" class="input" placeholder="Ex: Venda, Fornecedor X, Avaria..." />
      </div>
    </div>

    <p v-if="erro" class="form-erro">{{ erro }}</p>

    <div class="form-actions">
      <button class="btn btn-primary" :disabled="salvando" @click="registrar">
        {{ salvando ? 'Registrando...' : 'Registrar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  produtos:            { type: Array,    default: () => [] },
  registrarMovimento:  { type: Function, required: true },
  ajustarQuantidade:   { type: Function, required: true }
})

const salvando = ref(false)
const erro     = ref('')
const form     = ref({ prodId: '', tipo: 'entrada', qty: '', obs: '' })

async function registrar() {
  erro.value = ''
  if (!form.value.prodId)                             { erro.value = 'Selecione o produto.';                    return }
  if (!form.value.qty || +form.value.qty <= 0)        { erro.value = 'Quantidade deve ser maior que zero.';     return }

  const produto = props.produtos.find(p => p.id === form.value.prodId)
  if (!produto)                                        { erro.value = 'Produto não encontrado.';                return }
  if (form.value.tipo === 'saida' && +form.value.qty > produto.qtd) {
    erro.value = `Só há ${produto.qtd} unidades em estoque.`
    return
  }

  salvando.value = true
  try {
    const novaQtd = form.value.tipo === 'entrada'
      ? produto.qtd + +form.value.qty
      : produto.qtd - +form.value.qty

    await Promise.all([
      props.registrarMovimento({
        tipo:      form.value.tipo,
        prodId:    produto.id,
        prodNome:  produto.nome,
        qty:       +form.value.qty,
        obs:       form.value.obs
      }),
      props.ajustarQuantidade(produto.id, novaQtd)
    ])

    form.value = { prodId: '', tipo: 'entrada', qty: '', obs: '' }
  } catch (e) {
    erro.value = 'Erro ao registrar: ' + e.message
  } finally {
    salvando.value = false
  }
}
</script>
