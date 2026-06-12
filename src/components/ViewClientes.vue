<template>
  <div class="clientes-page">
    <div class="clientes-card">
      <div class="form-title">Cadastro de clientes</div>
      <div class="form-grid">
        <div class="form-group span2">
          <label>Nome *</label>
          <input v-model="form.nome" class="input" placeholder="Nome do cliente" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" class="input" placeholder="cliente@exemplo.com" />
        </div>
        <div class="form-group">
          <label>Telefone</label>
          <input v-model="form.telefone" class="input" placeholder="(99) 99999-9999" />
        </div>
        <div class="form-group">
          <label>CPF/CNPJ</label>
          <input v-model="form.documento" class="input" placeholder="000.000.000-00" />
        </div>
        <div class="form-group span2">
          <label>Bairro</label>
          <input v-model="form.bairro" class="input" placeholder="Bairro" />
        </div>
      </div>

      <p v-if="erro" class="form-erro">{{ erro }}</p>

      <div class="form-actions">
        <button class="btn btn-primary" :disabled="salvando" @click="salvar">
          {{ salvando ? 'Salvando...' : (editando ? 'Atualizar cliente' : 'Cadastrar cliente') }}
        </button>
        <button v-if="editando" class="btn" @click="cancelarEdicao">Cancelar</button>
      </div>
    </div>

    <div class="clientes-list">
      <div class="search-bar mb-12">
        <input v-model="busca" class="input" placeholder="Buscar cliente..." />
      </div>

      <div class="table-wrap">
        <table v-if="clientes.length > 0">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Bairro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
              <td>{{ cliente.nome }}</td>
              <td>{{ cliente.email || '—' }}</td>
              <td>{{ cliente.telefone || '—' }}</td>
              <td>{{ cliente.bairro || '—' }}</td>
              <td class="row-actions">
                <button class="btn btn-sm" @click="editar(cliente)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="excluir(cliente)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty">Nenhum cliente cadastrado.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  clientes:           { type: Array, default: () => [] },
  carregando:         { type: Boolean, default: false },
  clienteEditando:    { type: Object, default: null },
  adicionarCliente:   { type: Function, required: true },
  atualizarCliente:   { type: Function, required: true },
  excluirCliente:     { type: Function, required: true }
})
const emit = defineEmits(['cancelar', 'salvo', 'editar'])

const busca = ref('')
const editando = ref(false)
const salvando = ref(false)
const erro = ref('')

const form = ref({ nome: '', email: '', telefone: '', documento: '', bairro: '' })

function resetForm() {
  form.value = { nome: '', email: '', telefone: '', documento: '', bairro: '' }
}

watch(() => props.clienteEditando, c => {
  if (c) {
    editando.value = true
    form.value = {
      nome: c.nome || '',
      email: c.email || '',
      telefone: c.telefone || '',
      documento: c.documento || '',
      bairro: c.bairro || ''
    }
  } else {
    editando.value = false
    resetForm()
  }
}, { immediate: true })

const clientesFiltrados = computed(() => {
  const query = busca.value.trim().toLowerCase()
  if (!query) return props.clientes
  return props.clientes.filter(c =>
    c.nome.toLowerCase().includes(query) ||
    (c.email || '').toLowerCase().includes(query) ||
    (c.telefone || '').toLowerCase().includes(query) ||
    (c.bairro || '').toLowerCase().includes(query)
  )
})

async function salvar() {
  erro.value = ''
  if (!form.value.nome.trim()) {
    erro.value = 'Informe o nome do cliente.'
    return
  }

  salvando.value = true
  try {
    const dados = {
      nome: form.value.nome.trim(),
      email: form.value.email.trim(),
      telefone: form.value.telefone.trim(),
      documento: form.value.documento.trim(),
      bairro: form.value.bairro.trim()
    }
    if (editando.value && props.clienteEditando) {
      await props.atualizarCliente(props.clienteEditando.id, dados)
    } else {
      await props.adicionarCliente(dados)
    }
    resetForm()
    emit('salvo')
  } catch (e) {
    erro.value = 'Erro ao salvar cliente: ' + e.message
  } finally {
    salvando.value = false
  }
}

function editar(cliente) {
  emit('editar', cliente)
}

function cancelarEdicao() {
  resetForm()
  emit('cancelar')
}

function excluir(cliente) {
  if (confirm(`Excluir cliente ${cliente.nome}?`)) {
    props.excluirCliente(cliente.id)
  }
}
</script>

<style scoped>
.clientes-page {
  display: grid;
  gap: 22px;
}
.clientes-card,
.clientes-list {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 14px 28px rgba(18, 34, 18, 0.06);
}
.form-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1b3f27;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #4e6d53;
  font-size: 0.92rem;
}
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.mb-12 { margin-bottom: 1rem; }
.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.table-wrap table {
  width: 100%;
  border-collapse: collapse;
}
.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid #eef3ea;
  color: #334b38;
}
.table-wrap th { color: #5e7b61; font-size: 0.88rem; }
.table-wrap tr:hover { background: #fbfdf7; }
.empty { padding: 26px; text-align: center; color: #6f8b72; }
</style>
