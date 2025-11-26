import { test, expect, Page } from '@playwright/test';
import * as Todo from './modelsTodo';

async function envoyerRaccourci(page: Page, key: string) {
  await page.keyboard.down('Control');
  await page.keyboard.press(key);
  await page.keyboard.up('Control');
}


  test.beforeEach(async ({ page }) => {
    await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');

    // Vider la liste
    const liste = await Todo.lireListeVisible(page);
    for (const item of liste) {
      await Todo.actionSupprimerTache(page, item.label);
    }
  });

  test('CTRL+Z annule une action d’ajout', async ({ page }) => {
    await Todo.actionAjouterTache(page, 'Faire IHM');
    await Todo.verifItemPresent(page, 'Faire IHM');

    // CTRL+Z = Annuler
    await envoyerRaccourci(page, 'z');
    await Todo.verifListeVide(page);

    // CTRL+Y = Refaire
    await envoyerRaccourci(page, 'y');
    await Todo.verifItemPresent(page, 'Faire IHM');
  });

  test('CTRL+Z annule une action de cocher', async ({ page }) => {
    await Todo.actionAjouterTache(page, 'coucou');
    await Todo.actionCocherTache(page, 'coucou');
    await Todo.verifItemCoche(page, 'coucou', true);

    // CTRL+Z
    await envoyerRaccourci(page, 'z');
    await Todo.verifItemCoche(page, 'coucou', false);

    // CTRL+Y
    await envoyerRaccourci(page, 'y');
    await Todo.verifItemCoche(page, 'coucou', true);
  });

  test('CTRL+Z annule une suppression', async ({ page }) => {
    await Todo.actionAjouterTache(page, 'aaa');
    await Todo.actionSupprimerTache(page, 'aaa');
    await Todo.verifListeVide(page);

    // CTRL+Z
    await envoyerRaccourci(page, 'z');
    await Todo.verifItemPresent(page, 'aaa');

    // CTRL+Y
    await envoyerRaccourci(page, 'y');
    await Todo.verifListeVide(page);
  });

test('CTRL+Z / CTRL+Y ne font rien si aucune action possible', async ({ page }) => {
  // Liste vide
  await Todo.verifListeVide(page);

  // Intercepter les erreurs console
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // CTRL+Z ne doit rien faire
  await envoyerRaccourci(page, 'z');
  await Todo.verifListeVide(page);

  // CTRL+Y ne doit rien faire
  await envoyerRaccourci(page, 'y');
  await Todo.verifListeVide(page);

  // Vérifier qu’aucune erreur JS n’est apparue
  expect(consoleErrors.length).toBe(0);
});
