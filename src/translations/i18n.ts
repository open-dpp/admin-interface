import { createI18n } from "vue-i18n";
import enUS from './en-US.json';
import deDE from './de-DE.json';

export type MessageSchema = typeof deDE;

export const i18n = createI18n<[MessageSchema], 'en-US' | 'de-DE'>({
  legacy: false,
  locale: "en-US",
  fallbackLocale: "de-DE",
  messages: {
    'en-US': enUS,
    'de-DE': deDE
  },
});
