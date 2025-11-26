import { test } from "@playwright/test";
import * as Todo from "./modelsTodo";

test.describe("Étape bonus : Annuler / Refaire", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://alexdmr.github.io/l3m-2023-2024-angular-todolist/",
      {
        waitUntil: "networkidle",
        timeout: 15_000,
      }
    );
    const liste = await Todo.lireListeVisible(page);
    for (const item of liste) {
      await Todo.actionSupprimerTache(page, item.label);
    }
  });

  test("Annuler et Refaire après ajout d’une tâche", async ({ page }) => {
    // Ajouter une tâche
    await Todo.actionAjouterTache(page, "Faire IHM");
    await Todo.verifListeEgaleA(page, [{ label: "Faire IHM", done: false }]);

    // Annuler
    await Todo.actionAnnuler(page);
    await Todo.verifListeVide(page);

    // Refaire
    await Todo.actionRefaire(page);
    await Todo.verifListeEgaleA(page, [{ label: "Faire IHM", done: false }]);
  });

  test("Annuler et Refaire après compléter une tâche", async ({ page }) => {
    await Todo.actionAjouterTache(page, "coucou");

    // Cocher la tâche
    await Todo.actionCocherTache(page, "coucou");
    await Todo.verifItemCoche(page, "coucou", true);

    // Annuler
    await Todo.actionAnnuler(page);
    await Todo.verifItemCoche(page, "coucou", false);

    // Refaire
    await Todo.actionRefaire(page);
    await Todo.verifItemCoche(page, "coucou", true);
  });

  test("Annuler et Refaire après suppression d’une tâche", async ({ page }) => {
    await Todo.actionAjouterTache(page, "aaa");

    // Supprimer la tâche
    await Todo.actionSupprimerTache(page, "aaa");
    await Todo.verifListeVide(page);

    // Annuler
    await Todo.actionAnnuler(page);
    await Todo.verifItemPresent(page, "aaa");

    // Refaire
    await Todo.actionRefaire(page);
    await Todo.verifListeVide(page);
  });

  test("Chaîne d’actions multiples avec Annuler/Refaire", async ({ page }) => {
    // Ajouter 3 tâches
    await Todo.actionAjouterTache(page, "tache1");
    await Todo.actionAjouterTache(page, "tache2");
    await Todo.actionAjouterTache(page, "tache3");

    // Cocher la première
    await Todo.actionCocherTache(page, "tache1");

    // Supprimer la dernière
    await Todo.actionSupprimerTache(page, "tache3");

    // Vérification état courant
    await Todo.verifListeEgaleA(page, [
      { label: "tache1", done: true },
      { label: "tache2", done: false },
    ]);

    // Annuler 1 fois : supprime le dernier undo (supprimer tache3)
    await Todo.actionAnnuler(page);
    await Todo.verifListeEgaleA(page, [
      { label: "tache1", done: true },
      { label: "tache2", done: false },
      { label: "tache3", done: false },
    ]);

    // Annuler 2 fois : décoche tache1
    await Todo.actionAnnuler(page);
    await Todo.verifItemCoche(page, "tache1", false);

    // Annuler 3 fois : supprime tache3 ajoutée (la dernière ajoutée)
    await Todo.actionAnnuler(page);
    await Todo.verifListeEgaleA(page, [
      { label: "tache1", done: false },
      { label: "tache2", done: false },
    ]);

    // Refaire 3 fois : tout réapplique dans l’ordre
    await Todo.actionRefaire(page);
    await Todo.verifListeEgaleA(page, [
      { label: "tache1", done: false },
      { label: "tache2", done: false },
      { label: "tache3", done: false },
    ]);
    await Todo.actionRefaire(page);
    await Todo.verifItemCoche(page, "tache1", true);
    await Todo.actionRefaire(page);
    await Todo.verifListeEgaleA(page, [
      { label: "tache1", done: true },
      { label: "tache2", done: false },
    ]);
  });
});
