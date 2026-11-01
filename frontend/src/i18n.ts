import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_KEY = "kanban_language";

const resources = {
  pt: {
    translation: {
      common: {
        loading: "Carregando...",
        back: "Voltar",
        cancel: "Cancelar",
        delete: "Excluir",
        error: "Algo deu errado. Tente novamente.",
      },
      nav: {
        logout: "Sair",
        language: "Idioma",
      },
      auth: {
        loginTitle: "Entrar",
        registerTitle: "Criar conta",
        name: "Nome",
        email: "E-mail",
        password: "Senha",
        submitLogin: "Entrar",
        submitRegister: "Criar conta",
        noAccount: "Ainda não tem conta?",
        haveAccount: "Já tem uma conta?",
        goRegister: "Cadastre-se",
        goLogin: "Entrar",
        invalidCredentials: "E-mail ou senha inválidos.",
        emailTaken: "Este e-mail já está cadastrado.",
        invalidData: "Confira os dados: nome com 2+ letras, e-mail válido e senha com 6+ caracteres.",
      },
      boards: {
        title: "Meus quadros",
        newBoard: "Novo quadro",
        boardTitle: "Nome do quadro",
        create: "Criar",
        empty: "Você ainda não tem quadros. Crie o primeiro!",
        confirmDelete: "Excluir este quadro e todos os seus cards?",
      },
      kanban: {
        addCard: "Adicionar card",
        cardTitle: "Título do card",
        add: "Adicionar",
        emptyColumn: "Nenhum card aqui.",
        notFound: "Quadro não encontrado.",
        columns: {
          todo: "A fazer",
          doing: "Em andamento",
          done: "Concluído",
        },
      },
    },
  },
  en: {
    translation: {
      common: {
        loading: "Loading...",
        back: "Back",
        cancel: "Cancel",
        delete: "Delete",
        error: "Something went wrong. Please try again.",
      },
      nav: {
        logout: "Log out",
        language: "Language",
      },
      auth: {
        loginTitle: "Log in",
        registerTitle: "Create account",
        name: "Name",
        email: "Email",
        password: "Password",
        submitLogin: "Log in",
        submitRegister: "Create account",
        noAccount: "Don't have an account yet?",
        haveAccount: "Already have an account?",
        goRegister: "Sign up",
        goLogin: "Log in",
        invalidCredentials: "Invalid email or password.",
        emailTaken: "This email is already registered.",
        invalidData: "Check your data: name with 2+ letters, a valid email and a password with 6+ characters.",
      },
      boards: {
        title: "My boards",
        newBoard: "New board",
        boardTitle: "Board name",
        create: "Create",
        empty: "You don't have any boards yet. Create the first one!",
        confirmDelete: "Delete this board and all of its cards?",
      },
      kanban: {
        addCard: "Add card",
        cardTitle: "Card title",
        add: "Add",
        emptyColumn: "No cards here.",
        notFound: "Board not found.",
        columns: {
          todo: "To do",
          doing: "In progress",
          done: "Done",
        },
      },
    },
  },
};

function getInitialLanguage(): "pt" | "en" {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    // localStorage unavailable; fall back to the browser language
  }

  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // ignore storage errors
  }
});

export default i18n;