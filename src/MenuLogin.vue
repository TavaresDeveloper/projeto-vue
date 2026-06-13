<template>
  <div class="menuLogin">
    <div class="loginCard">
      <div class="loginHeader">
        <span class="loginIcon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v18" />
            <path d="M3 12h18" />
            <path d="M7.5 7.5l9 9" />
            <path d="M16.5 7.5l-9 9" />
          </svg>
        </span>
        <div>
          <h1>{{ isRegister ? 'Criar conta' : 'Entrar no sistema' }}</h1>
          <p class="subtitle">
            {{ isRegister ? 'Abra sua conta com email e senha.' : 'Acesse o painel usando seu email e senha.' }}
          </p>
        </div>
      </div>

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
  background: radial-gradient(circle at top, #07111f 0%, #020408 62%, #000 100%);
  padding: 1.2rem;
}
.loginCard {
  width: min(460px, 100%);
  background: rgba(8, 17, 29, 0.96);
  padding: 2.2rem 1.9rem;
  border-radius: 26px;
  box-shadow: 0 28px 70px rgba(2, 8, 18, 0.65);
  border: 1px solid rgba(69, 209, 255, 0.15);
  display: grid;
  gap: 1rem;
}
.loginCard h1 {
  margin: 0;
  font-size: 2rem;
  color: #d8f7ff;
}
.subtitle {
  margin: 0;
  color: rgba(216, 247, 255, 0.72);
  font-size: 0.95rem;
}
.inputGroup {
  display: grid;
  gap: 0.55rem;
}
.inputGroup label {
  font-size: 0.95rem;
  color: rgba(212, 238, 255, 0.7);
}
.inputGroup input {
  width: 100%;
  padding: 13px 14px;
  border-radius: 14px;
  border: 1px solid rgba(69, 209, 255, 0.22);
  background: rgba(5, 13, 24, 0.95);
  color: #edf9ff;
  font-size: 1rem;
}
.inputGroup input:focus {
  outline: none;
  border-color: rgba(69, 209, 255, 0.8);
  box-shadow: 0 0 0 3px rgba(69, 209, 255, 0.12);
}
.erro {
  margin: 0;
  color: #ff8a8a;
  font-size: 0.92rem;
}
button {
  border: none;
  background: linear-gradient(135deg, rgba(69, 209, 255, 0.96), rgba(11, 129, 207, 0.96));
  color: #03131f;
  padding: 13px 16px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform .18s, filter .18s;
}
button:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.footerText {
  color: rgba(216, 247, 255, 0.72);
  font-size: 0.94rem;
}
.linkButton {
  border: none;
  background: transparent;
  color: #7ee3ff;
  font-weight: 700;
  cursor: pointer;
}
.linkButton:hover { text-decoration: underline; }
</style>