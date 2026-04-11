// src/composables/useMovimentos.js
import { ref } from 'vue'
import {
  collection, onSnapshot, addDoc,
  serverTimestamp, query, orderBy, limit
} from 'firebase/firestore'
import { db } from '@/firebase.js'

export function useMovimentos() {
  const movimentos = ref([])
  const carregando = ref(true)

  const unsub = onSnapshot(
    query(collection(db, 'movimentos'), orderBy('criadoEm', 'desc'), limit(100)),
    snapshot => {
      movimentos.value = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        ts: d.data().criadoEm?.toDate?.() ?? new Date()
      }))
      carregando.value = false
    }
  )

  async function registrarMovimento({ tipo, prodId, prodNome, qty, obs }) {
    await addDoc(collection(db, 'movimentos'), {
      tipo,
      prodId,
      prodNome,
      qty,
      obs: obs || '',
      criadoEm: serverTimestamp()
    })
  }

  function fmtHora(ts) {
    if (!ts) return '—'
    const d = ts instanceof Date ? ts : new Date(ts)
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    if (d >= hoje) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return { movimentos, carregando, registrarMovimento, fmtHora, unsub }
}
