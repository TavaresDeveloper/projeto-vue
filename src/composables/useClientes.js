import { ref, computed } from 'vue'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase.js'

export function useClientes() {
  const clientes = ref([])
  const carregando = ref(true)
  const erro = ref(null)

  const unsub = onSnapshot(
    query(collection(db, 'clientes'), orderBy('nome')),
    snapshot => {
      clientes.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      carregando.value = false
    },
    err => {
      erro.value = err.message
      carregando.value = false
    }
  )

  const totalClientes = computed(() => clientes.value.length)

  async function adicionarCliente(dados) {
    await addDoc(collection(db, 'clientes'), {
      ...dados,
      criadoEm: serverTimestamp()
    })
  }

  async function atualizarCliente(id, dados) {
    await updateDoc(doc(db, 'clientes', id), {
      ...dados,
      atualizadoEm: serverTimestamp()
    })
  }

  async function excluirCliente(id) {
    await deleteDoc(doc(db, 'clientes', id))
  }

  return {
    clientes,
    carregando,
    erro,
    totalClientes,
    adicionarCliente,
    atualizarCliente,
    excluirCliente,
    unsub
  }
}
