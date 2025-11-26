import { test, expect } from '@playwright/test';
import {
  actionAjouterTache,
  actionCocherTache,
  actionSupprimerTache,
  verifListeVide,
  verifCompteur,
  verifItemCoche,
  verifItemAbsent,
} from './modelsTodo';


  test.beforeEach(async ({ page }) => {
    await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');

    const lignes = page.locator('.todoapp .todo-list > li');
    const nb = await lignes.count();
    for (let i = 0; i < nb; i++) {
      const ligne = lignes.nth(i);
      await ligne.hover();
      const boutonSuppr = ligne.locator('button.destroy');
      await expect(boutonSuppr).toBeVisible();
      await boutonSuppr.click();
    }

    await verifListeVide(page);
  });

  test('Cocher et décocher une tâche met à jour le compteur', async ({ page }) => {
    await actionAjouterTache(page, 'Faire IHM');
    await verifCompteur(page, 1);
    await actionCocherTache(page, 'Faire IHM');
    await verifItemCoche(page, 'Faire IHM', true);
    await verifCompteur(page, 0);
    await actionCocherTache(page, 'Faire IHM');
    await verifItemCoche(page, 'Faire IHM', false);
    await verifCompteur(page, 1);
  });

  test('Supprimer une tâche met à jour la liste et le compteur', async ({ page }) => {
    await actionAjouterTache(page, 'coucou');
    await actionAjouterTache(page, 'aaa');
    await verifCompteur(page, 2);
    await actionSupprimerTache(page, 'coucou');
    await verifItemAbsent(page, 'coucou');
    await verifCompteur(page, 1);
  });
