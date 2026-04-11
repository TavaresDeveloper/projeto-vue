// src/composables/useProdutos.js
import { ref, computed } from 'vue'
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '@/firebase.js'

export const CATEGORIAS = [
  'Alimentos', 'Bebidas', 'Limpeza', 'Higiene',
  'Hortifruti', 'Frios', 'Padaria', 'Outros'
]

export function useProdutos() {
  const produtos   = ref([])
  const carregando = ref(true)
  const erro       = ref(null)

  // Listener em tempo real — atualiza automaticamente
  const unsub = onSnapshot(
    query(collection(db, 'produtos'), orderBy('nome')),
    snapshot => {
      produtos.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      carregando.value = false
    },
    err => {
      erro.value = err.message
      carregando.value = false
    }
  )

  // ── Métricas ──────────────────────────────────────────────
  const totalProdutos  = computed(() => produtos.value.length)
  const totalItens     = computed(() => produtos.value.reduce((a, p) => a + (p.qtd ?? 0), 0))
  const valorEstoque   = computed(() => produtos.value.reduce((a, p) => a + ((p.qtd ?? 0) * (p.custo ?? 0)), 0))
  const semEstoque     = computed(() => produtos.value.filter(p => p.qtd === 0).length)
  const estoqueBaixo   = computed(() => produtos.value.filter(p => p.qtd > 0 && p.qtd <= p.min).length)
  const alertas        = computed(() => produtos.value.filter(p => p.qtd <= p.min))

  // ── Status ────────────────────────────────────────────────
  function statusProduto(p) {
    if (p.qtd === 0)         return 'out'
    if (p.qtd <= p.min)      return 'low'
    return 'ok'
  }
  function statusLabel(p) {
    if (p.qtd === 0)         return 'Sem estoque'
    if (p.qtd <= p.min)      return 'Estoque baixo'
    return 'Normal'
  }

  // ── CRUD ──────────────────────────────────────────────────
  async function adicionarProduto(dados) {
    await addDoc(collection(db, 'produtos'), {
      ...dados,
      criadoEm: serverTimestamp()
    })
  }

  async function atualizarProduto(id, dados) {
    await updateDoc(doc(db, 'produtos', id), {
      ...dados,
      atualizadoEm: serverTimestamp()
    })
  }

  async function excluirProduto(id) {
    await deleteDoc(doc(db, 'produtos', id))
  }

  // Ajusta apenas a quantidade (usado pela movimentação)
  async function ajustarQuantidade(id, novaQtd) {
    await updateDoc(doc(db, 'produtos', id), {
      qtd: novaQtd,
      atualizadoEm: serverTimestamp()
    })
  }

  return {
    produtos, carregando, erro,
    totalProdutos, totalItens, valorEstoque, semEstoque, estoqueBaixo, alertas,
    statusProduto, statusLabel,
    adicionarProduto, atualizarProduto, excluirProduto, ajustarQuantidade,
    unsub
  }
}
