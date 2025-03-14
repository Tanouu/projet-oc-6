import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',  // Assure-toi que ton serveur tourne sur ce port
    setupNodeEvents(on, config) {
      // Tu peux ajouter d'autres événements ou configurations ici si nécessaire
      // Par exemple, un événement pour enregistrer des logs, etc.
    },
  },
});
