<template>
  <div class="menuLogin">
    <div class="loginCard">
      <h1>{{ isRegister ? 'Criar conta' : 'Entrar no sistema' }}</h1>
      <p class="subtitle">
        {{ isRegister ? 'Abra sua conta com email e senha.' : 'Acesse o painel usando seu email e senha.' }}
      </p>

      <div class="inputGroup">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="form.email" autocomplete="username" />
      </div>

      <div class="inputGroup">
        <label for="senha">Senha</label>
        <input id="senha" type="password" v-model="form.senha" autocomplete="current-password" />
      </div>

      <p v-if="erro" class="erro">{{ erro }}</p>

      <button @click="handleSubmit" :disabled="isLoading">
        {{ isLoading ? 'Aguarde...' : (isRegister ? 'Cadastrar' : 'Entrar') }}
      </button>

      <p class="footerText">
        {{ isRegister ? 'Já tem conta?' : 'Ainda não tem conta?' }}
        <button type="button" class="linkButton" @click="toggleRegister">
          {{ isRegister ? 'Entrar' : 'Cadastrar' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const form = ref({ email: '', senha: '' })
const isLoading = ref(false)
const erro = ref('')
const isRegister = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function toggleRegister() {
  isRegister.value = !isRegister.value
  erro.value = ''
}

function handleSubmit() {
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
  const action = isRegister.value
    ? createUserWithEmailAndPassword(auth, form.value.email, form.value.senha)
    : signInWithEmailAndPassword(auth, form.value.email, form.value.senha)

  action
    .then(() => router.push('/estoque'))
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        erro.value = 'Este email já está cadastrado.'
      } else if (error.code === 'auth/invalid-email') {
        erro.value = 'Por favor, insira um email válido.'
      } else if (error.code === 'auth/weak-password') {
        erro.value = 'A senha deve ter pelo menos 6 caracteres.'
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        erro.value = 'Email ou senha inválidos.'
      } else {
        erro.value = 'Não foi possível processar. ' + (error.message || '')
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<style scoped>
.menuLogin {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef7ee;
  padding: 1rem;
}
.loginCard {
  width: min(420px, 100%);
  background: #fff;
  padding: 2rem 1.8rem;
  border-radius: 20px;
  box-shadow: 0 20px 45px rgba(15, 40, 19, 0.08);
  display: grid;
  gap: 1rem;
}
.loginCard h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #1e3a27;
}
.subtitle {
  margin: 0;
  color: #5c6b5b;
  font-size: 0.95rem;
}
.inputGroup {
  display: grid;
  gap: 0.5rem;
}
.inputGroup label {
  font-size: 0.95rem;
  color: #4c5a4c;
}
.inputGroup input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d3dbd3;
  font-size: 1rem;
}
.erro {
  margin: 0;
  color: #bf2d2d;
  font-size: 0.92rem;
}
button {
  border: none;
  background: #1d6d37;
  color: #fff;
  padding: 13px 16px;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>