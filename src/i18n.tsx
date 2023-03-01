import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const translationEng = {
  WELCOME: "welcome",
  TODOS: "TODOS",
  TODO_DETAILS: "TODO Details",
  DYNAMIC_PARALLEL: "Dynamic Parallel Queries",
  PAGINATED: "Pagination",
  INFINITE: "Infinte Query",
  MUTATION: "Mutation Query",
  DEPENDENT: "Dependent Query",
  NAME: "Name",
  AGE: "Age",
  ADDRESS: "Address",
};

const translationHindi = {
  WELCOME: "स्वागत हे",
  TODOS: "अस्वीकार कर दिया",
  TODO_DETAILS: "टोडो विवरण",
  PENDING_APPROVAL: "लंबित अनुमोदन",
  DYNAMIC_PARALLEL: "गतिशील समानांतर",
  REJECTED: "अस्वीकृत",
  PUBLISHED: "प्रकाशित",
  ALL: "सभी",
  NAME: "नाम",
  AGE: "आयु",
  ADDRESS: "पता",
};

const translationChile = {
  WELCOME: "bienvenidos",
  TODOS: "RECHAZADO",
  TODO_DETAILS: "Todo detalles",
  DYNAMIC_PARALLEL: "Paralelo dinámico",
  PENDING_APPROVAL: "En attente de validation",
  REJECTED: "Rejeté",
  PUBLISHED: "Publié",
  ALL: "Tout",
};
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: { translation: translationEng },
      hi: { translation: translationHindi },
      cl: { translation: translationChile },
    },
    react: {
      bindI18n: "languageChanged",
      bindI18nStore: "",
      transEmptyNodeValue: "",
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ["br", "strong", "i"],
      useSuspense: true,
    },
  });

export default i18n;
