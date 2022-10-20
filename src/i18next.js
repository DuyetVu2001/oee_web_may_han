import React from "react";
import ReactDOM from "react-dom";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

import vn from './lang/vn.json';
import en from './lang/en.json';
import ja from './lang/jp.json';
import ko from './lang/ko.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: en,
      },
      vn: {
        translation: vn,
      },
      ja: {
        translation: ja,
      },
      ko: {
        translation: ko,
      },
    },
    lng: localStorage.getItem("lang") || "vn", // if you're using a language detector, do not define the lng option
    fallbackLng: ["en", "vn", "ja", "ko"],

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });
