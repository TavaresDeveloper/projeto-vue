<template>
  <div class="menuLogin">
    <h1>Faça seu cadastro</h1>
    <div class="cadastro">
      <div class="input">
        <label for="email">Email:</label>
        <input id="email" type="email" v-model="form.email" />
      </div>
      <div class="input">
        <label for="senha">Senha:</label>
        <input id="senha" type="password" v-model="form.senha" />
      </div>
      <p v-if="erro" style="color:red; font-size:13px;">{{ erro }}</p>
      <button @click="handleLogin" :disabled="isLoading">
        {{ isLoading ? 'Aguarde...' : 'Cadastrar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ email: '', senha: '' })
const isLoading = ref(false)
const erro = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function handleLogin() {
  erro.value = ''
  if (!emailRegex.test(form.value.email)) {
    erro.value = 'Por favor, insira um email válido.'
    return
  }
  if (form.value.senha.length < 6) {
    erro.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    router.push('/estoque')
  }, 1000)
}
</script>

<style scoped>
.menuLogin {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #eef7ee 0%, #dfe9dd 100%);
  padding: 1.5rem;
}
.cadastro {
  width: min(420px, 100%);
  display: grid;
  gap: 18px;
  background: #fff;
  padding: 2.2rem 2rem;
  border-radius: 24px;
  box-shadow: 0 18px 32px rgba(15, 40, 19, 0.12);
}
.cadastro h1 {
  margin: 0;
  color: #16482e;
  font-size: 1.8rem;
}
.input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input label {
  font-size: 0.95rem;
  color: #4b6b55;
}
.input input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cfd9cf;
  font-size: 1rem;
}
button {
  border: none;
  background: #1d6d37;
  color: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled { opacity: 0.7; cursor: not-allowed; }
</style>