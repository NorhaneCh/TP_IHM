import { test, expect } from '@playwright/test';
import * as Todo from './modelsTodo';

test.describe('Comportement et erreurs UI', () => {

  test('Vérifie que les boutons Annuler/Refaire et Supprimer cochées sont désactivés quand rien à faire', async ({ page }) => {
    await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');

    // S'assurer que la liste est vide
    await Todo.verifListeVide(page);

    // Vérifier que les boutons sont désactivés
    await Todo.verifUndoDisabled(page, true);
    await Todo.verifRedoDisabled(page, true);
    await Todo.verifBoutonSupprimerCocheesVisible(page, false);
  });


});
