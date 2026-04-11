# Mercadinho — Controle de Estoque

Sistema de controle de estoque para mercadinho de bairro.  
**Stack:** Vue 3 (Composition API) + Vite + Firebase Firestore

---

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar o Firebase

Edite o arquivo `src/firebase.js` e substitua os valores de exemplo pelas
credenciais reais do seu projeto:

- Acesse [Firebase Console](https://console.firebase.google.com)
- Selecione seu projeto → Configurações do projeto → Seus apps
- Copie o objeto `firebaseConfig` e cole em `src/firebase.js`

### 3. Criar as coleções no Firestore

No Firebase Console → Firestore Database, crie duas coleções:

| Coleção      | Campos do documento                                     |
|--------------|---------------------------------------------------------|
| `produtos`   | nome, cat, preco, custo, qtd, min, criadoEm             |
| `movimentos` | tipo, prodId, prodNome, qty, obs, criadoEm              |

As coleções são criadas automaticamente na primeira inserção pelo app.

### 4. Aplicar as regras do Firestore
```bash
# Com Firebase CLI instalado:
firebase deploy --only firestore:rules
```
Ou cole o conteúdo de `firestore.rules` manualmente no console.

### 5. Rodar em desenvolvimento
```bash
npm run dev
```

### 6. Build para produção
```bash
npm run build
```

---

## 📁 Estrutura do projeto

```
src/
├── firebase.js                   # Configuração do Firebase
├── main.js                       # Entry point Vue
├── App.vue                       # Componente raiz + estilos globais
├── composables/
│   ├── useProdutos.js            # CRUD + métricas de produtos (Firestore)
│   └── useMovimentos.js          # Registro de movimentações (Firestore)
└── components/
    ├── ViewEstoque.vue            # Tab: listagem e busca
    ├── ViewCadastro.vue           # Tab: cadastro e edição
    ├── ViewMovimentacao.vue       # Tab: entrada e saída
    └── ViewHistorico.vue          # Tab: histórico de movimentos
```

---

## ✨ Funcionalidades

- **Estoque em tempo real** — sincronização via `onSnapshot` do Firestore
- **Métricas** — total de produtos, itens, valor em estoque (pelo custo), alertas
- **Alerta automático** — destaca produtos com estoque zerado ou abaixo do mínimo
- **Cadastro de produtos** — nome, categoria, preço de venda, custo, quantidade e mínimo
- **Movimentação** — entradas (reposição) e saídas (vendas/perdas), com validação
- **Histórico** — últimas 100 movimentações ordenadas por data
- **Responsivo** — funciona em desktop e mobile

---

## 🔒 Próximos passos (produção)

- Adicionar Firebase Authentication para proteger as rotas
- Atualizar `firestore.rules` para exigir `request.auth != null`
- Adicionar exportação CSV do estoque
- Criar relatório de movimentações por período
