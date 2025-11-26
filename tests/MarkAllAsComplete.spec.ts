import { test } from "@playwright/test";
import * as Todo from "./modelsTodo";

test.beforeEach(async ({ page }) => {
  await page.goto("https://alexdmr.github.io/l3m-2023-2024-angular-todolist/");

  const liste = await Todo.lireListeVisible(page);
  for (const item of liste) {
    await Todo.actionSupprimerTache(page, item.label);
  }
  await Todo.actionAjouterTache(page, "Faire IHM");
  await Todo.actionAjouterTache(page, "coucou");
  await Todo.actionAjouterTache(page, "aaa");
});

test("Mark all as complete coche toutes les tâches et met le compteur à 0", async ({
  page,
}) => {
  await Todo.verifTousCoches(page, false);
  await Todo.actionToutCocher(page);
  await Todo.verifTousCoches(page, true);
  const nbItems = await Todo.lireListeVisible(page);
  await Todo.verifCompteur(page, nbItems.filter((i) => !i.done).length);
});

test('Recliquer sur "Mark all as complete" décoche toutes les tâches', async ({
  page,
}) => {
  await Todo.actionToutCocher(page);
  await Todo.verifTousCoches(page, true);
  await Todo.actionToutCocher(page);
  await Todo.verifTousCoches(page, false);
  const nbItems = await Todo.lireListeVisible(page);
  await Todo.verifCompteur(page, nbItems.filter((i) => !i.done).length);
});

test("Supprimer les tâches complétées", async ({ page }) => {
  await Todo.actionToutCocher(page);
  await Todo.actionSupprimerCochees(page);
  await Todo.verifListeVide(page);
  await Todo.verifCompteur(page, 0);
});
