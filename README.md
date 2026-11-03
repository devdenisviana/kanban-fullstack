# Kanban Full Stack

🇺🇸 [English](#english) · 🇧🇷 [Português](#português)

**Live demo:** https://kanban-fullstack-gold.vercel.app
**API:** https://kanban-api-sc50.onrender.com/health

> The API runs on a free hosting plan and goes to sleep after a period of inactivity. The first request can take 30–60 seconds; after that it responds normally.

---

## English

A full stack Kanban task manager: users sign up, log in, create boards and organize cards across columns with drag and drop. Built as a portfolio project to demonstrate a complete, deployed application.

### Features

- Sign up and log in with JWT authentication; passwords are hashed with bcrypt
- Boards, columns and cards, with ownership checks so each user only sees their own data
- Drag and drop cards between columns, with optimistic updates
- Interface in English and Portuguese, remembered between visits
- Responsive layout

### Tech stack

| Layer | Technologies |
|---|---|
| Front end | React, TypeScript, Vite, React Router, dnd-kit, react-i18next, HTML, CSS |
| Back end | Node.js, Express, TypeScript, Zod (validation), JWT, bcryptjs |
| Database | PostgreSQL (Neon), Prisma ORM |
| Deploy | Vercel (front end), Render (API), Neon (database) |

### Project structure

```
kanban-fullstack/
├── backend/    # Express API, Prisma schema and migrations
└── frontend/   # React application
```

### API overview

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create an account | No |
| POST | `/auth/login` | Log in and receive a token | No |
| GET | `/auth/me` | Current user | Yes |
| GET / POST | `/boards` | List / create boards | Yes |
| GET / DELETE | `/boards/:id` | Get / delete a board | Yes |
| POST | `/cards` | Create a card | Yes |
| PATCH / DELETE | `/cards/:id` | Update, move / delete a card | Yes |

### Running locally

Requirements: Node.js 22 or newer, Git and a PostgreSQL database (for example a free one on [Neon](https://neon.com)).

```bash
git clone https://github.com/devdenisviana/kanban-fullstack.git
cd kanban-fullstack
```

**Back end**

```bash
cd backend
npm install
```

Create `backend/.env`:

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="a-long-random-string"
```

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

The API runs on `http://localhost:3333`.

**Front end** (in another terminal)

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3333
```

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

### Possible improvements

- Reorder cards within the same column
- Edit card titles and descriptions in the interface
- Automated tests for the API routes
- Rename and add columns

### Author

**Denis Viana** · [GitHub](https://github.com/devdenisviana)

---

## Português

Gerenciador de tarefas Kanban full stack: o usuário se cadastra, faz login, cria quadros e organiza cards entre colunas com arrastar e soltar. Projeto de portfólio feito para demonstrar uma aplicação completa e publicada.

### Funcionalidades

- Cadastro e login com autenticação JWT; senhas criptografadas com bcrypt
- Quadros, colunas e cards, com verificação de dono: cada usuário só vê os próprios dados
- Arrastar e soltar cards entre colunas, com atualização otimista
- Interface em português e inglês, com a escolha lembrada entre as visitas
- Layout responsivo

### Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | React, TypeScript, Vite, React Router, dnd-kit, react-i18next, HTML, CSS |
| Back-end | Node.js, Express, TypeScript, Zod (validação), JWT, bcryptjs |
| Banco de dados | PostgreSQL (Neon), Prisma ORM |
| Deploy | Vercel (front-end), Render (API), Neon (banco) |

### Como rodar localmente

Siga os mesmos passos da seção [Running locally](#running-locally) acima. Resumo:

1. Clone o repositório e instale as dependências em `backend` e `frontend` (`npm install`).
2. Crie `backend/.env` com `DATABASE_URL` e `JWT_SECRET`, e `frontend/.env` com `VITE_API_URL`.
3. No `backend`, rode `npx prisma migrate deploy`, `npx prisma generate` e `npm run dev`.
4. No `frontend`, rode `npm run dev`.

### Melhorias possíveis

- Reordenar cards dentro da mesma coluna
- Editar título e descrição dos cards pela interface
- Testes automatizados para as rotas da API
- Renomear e adicionar colunas

### Autor

**Denis Viana** · [GitHub](https://github.com/devdenisviana)

---

Licença / License: MIT