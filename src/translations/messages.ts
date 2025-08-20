import { createI18n } from "vue-i18n";

export const messages = {
  en: {
    draft: {
      edit: "Edit",
      selection: "Selection",
      addSection: "Add Section",
      addDataField: "Add data field",
      textField: "Text field",
      addTextField: "Add a text field",
      passportLink: "Passport link",
      addPassportLink: "Add a link to another passport",
      numberField: "Numeric field",
      addNumberField: "Add a numeric field",
      fileField: "File",
      addFileField: "Add file upload",
      passportDraft: "Passport draft | Passport drafts",
      passportDraftDescription: "All passport drafts",
    },
  },
  de: {
    draft: {
      edit: "Editieren",
      selection: "Auswahl",
      addSection: "Abschnitt hinzufügen",
      addDataField: "Datenfeld hinzufügen",
      textField: "Textfeld",
      addTextField: "Fügen Sie ein Textfeld hinzu",
      passportLink: "Produktpass Verlinkung",
      addPassportLink: "Fügen Sie eine Verlinkung zu einem Produktpass hinzu",
      numberField: "Numerisches Feld",
      addNumberField: "Numerisches Feld",
      fileField: "Datei",
      addFileField: "Fügen Sie einen Dateiupload hinzu",
      passportDraft: "Passvorlagen Entwurf | Passvorlagen Entwurf",
      passportDraftDescription: "Alle Passvorlagen Entwürfe",
    },
  },
};

export const i18n = createI18n({
  locale: "en",
  fallbackLocale: "de",
  messages,
});
