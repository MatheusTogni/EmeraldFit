# EmeraldFit

Plataforma web para gerenciamento de treinos e exercícios fitness.

## Sobre o Projeto

Aplicação full-stack para criação e gerenciamento de treinos personalizados com diferentes níveis de dificuldade.

## Tecnologias

**Frontend:**
- Vue 3 + TypeScript
- Vuetify 3 (Material Design)
- Pinia (State Management)
- Vite

**Backend:**
- NestJS + TypeScript
- TypeORM
- PostgreSQL

## Funcionalidades

- CRUD de treinos (nome, descrição, nível, ícones)
- CRUD de exercícios vinculados aos treinos
- Interface responsiva e moderna
- API RESTful

## Como Executar

### Backend

```bash
cd EmeraldFit-back
npm install

# Configure o .env:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=seu_usuario
# DATABASE_PASSWORD=sua_senha
# DATABASE_NAME=emeraldfit
# PORT=4001

npm run dev
```

### Frontend

```bash
cd EmeraldFit-front
npm install
npm run dev
```

## API Endpoints

**Treinos:**
- `GET /treinos` - Lista todos
- `GET /treinos/:id` - Busca por ID
- `POST /treinos` - Cria novo
- `PATCH /treinos/:id` - Atualiza
- `DELETE /treinos/:id` - Remove

**Exercícios:**
- `GET /exercicios-treino` - Lista todos
- `GET /exercicios-treino/:id` - Busca por ID
- `POST /exercicios-treino` - Cria novo
- `PATCH /exercicios-treino/:id` - Atualiza
- `DELETE /exercicios-treino/:id` - Remove

## Estrutura

```
EmeraldFit/
├── EmeraldFit-front/    # Vue.js + Vuetify
└── EmeraldFit-back/     # NestJS + TypeORM
```

## Licença

UNLICENSED
