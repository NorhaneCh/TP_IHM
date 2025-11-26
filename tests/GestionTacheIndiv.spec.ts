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

test.describe('Gestion des tâches individuelles', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');

    // Vider la liste existante
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
    // Ajouter une tâche
    await actionAjouterTache(page, 'Faire IHM');

    // Vérifier que le compteur est à 1
    await verifCompteur(page, 1);

    // Cocher la tâche
    await actionCocherTache(page, 'Faire IHM');

    // Vérifier qu’elle est cochée et que le compteur passe à 0
    await verifItemCoche(page, 'Faire IHM', true);
    await verifCompteur(page, 0);

    // Décocher la tâche
    await actionCocherTache(page, 'Faire IHM');

    // Vérifier qu’elle est décochée et que le compteur revient à 1
    await verifItemCoche(page, 'Faire IHM', false);
    await verifCompteur(page, 1);
  });

  test('Supprimer une tâche met à jour la liste et le compteur', async ({ page }) => {
    // Ajouter plusieurs tâches
    await actionAjouterTache(page, 'coucou');
    await actionAjouterTache(page, 'aaa');

    // Vérifier le compteur
    await verifCompteur(page, 2);

    // Supprimer la première tâche
    await actionSupprimerTache(page, 'coucou');

    // Vérifier qu’elle n’est plus présente et que le compteur est mis à jour
    await verifItemAbsent(page, 'coucou');
    await verifCompteur(page, 1);
  });

});
