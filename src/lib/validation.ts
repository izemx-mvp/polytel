/** Messages d'erreur zod en français, réutilisables. */
export const fr = {
  required: "Ce champ est obligatoire.",
  name: "Indiquez votre nom (2 caractères minimum).",
  email: "Adresse e-mail invalide.",
  phone: "Numéro de téléphone invalide (ex. 06 12 34 56 78).",
  message: "Votre message doit contenir au moins 10 caractères.",
  choose: "Veuillez faire un choix.",
};

export const phoneRegex = /^(?:\+?\d[\d\s.-]{7,18}\d)$/;
