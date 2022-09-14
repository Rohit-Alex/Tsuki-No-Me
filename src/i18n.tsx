import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const translationEng = { WELCOME: "welcome", TODOS: 'TODOS', TODO_DETAILS: 'TODO Details', DYNAMIC_PARALLEL: 'Dynamic Parallel Queries', PAGINATED: 'Pagination', INFINITE: 'Infinte Query', MUTATION: 'Mutation Query', DEPENDENT: 'Dependent Query', NAME: 'Name', AGE: 'Age', ADDRESS: 'Address'};

const translationHindi = { WELCOME: "स्वागत हे", PENDING_APPROVAL: 'लंबित अनुमोदन', REJECTED: 'अस्वीकृत', PUBLISHED: 'प्रकाशित', ALL: 'सभी', NAME: 'नाम', AGE: 'आयु', ADDRESS: 'पता' };

const translationChile = { WELCOME: "bienvenidos", PENDING_APPROVAL: 'En attente de validation', REJECTED: 'Rejeté', PUBLISHED: 'Publié', ALL: 'Tout'  };
i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
    .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
    .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'en',
        debug: true,
        interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: { translation: translationEng },
            hi: { translation: translationHindi },
            cl: { translation: translationChile }
        },
        react: {
            bindI18n: 'languageChanged',
            bindI18nStore: '',
            transEmptyNodeValue: '',
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
            useSuspense: true,
        }
    });


export default i18n;