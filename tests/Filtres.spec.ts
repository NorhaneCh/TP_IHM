import { test } from '@playwright/test';
import * as Todo from './modelsTodo';


  test.beforeEach(async ({ page }) => {
    await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');

    const liste = await Todo.lireListeVisible(page);
    for (const item of liste) {
      await Todo.actionSupprimerTache(page, item.label);
    }
    await Todo.actionAjouterTache(page, 'Faire IHM');
    await Todo.actionAjouterTache(page, 'coucou');
    await Todo.actionAjouterTache(page, 'aaa');
    await Todo.actionCocherTache(page, 'Faire IHM');
  });

  test('Filtre "Tous" affiche toutes les tâches', async ({ page }) => {
    await Todo.actionAppliquerFiltre(page, 'all');
    await Todo.verifItemPresent(page, 'Faire IHM');
    await Todo.verifItemPresent(page, 'coucou');
    await Todo.verifItemPresent(page, 'aaa');
    await Todo.verifFiltreSelectionne(page, 'all');
    await Todo.verifCompteur(page, 2); 
  });

  test('Filtre "Actifs" affiche uniquement les tâches non terminées', async ({ page }) => {
    await Todo.actionAppliquerFiltre(page, 'active');
    await Todo.verifItemPresent(page, 'coucou');
    await Todo.verifItemPresent(page, 'aaa');
    await Todo.verifItemAbsent(page, 'Faire IHM');
    await Todo.verifFiltreSelectionne(page, 'active');
    await Todo.verifCompteur(page, 2);
  });

  test('Filtre "Complétés" affiche uniquement les tâches terminées', async ({ page }) => {
    await Todo.actionAppliquerFiltre(page, 'completed');
    await Todo.verifItemPresent(page, 'Faire IHM');
    await Todo.verifItemAbsent(page, 'coucou');
    await Todo.verifItemAbsent(page, 'aaa');
    await Todo.verifFiltreSelectionne(page, 'completed');
    await Todo.verifCompteur(page, 2);
  });

  test('Repasser sur "Tous" réaffiche toutes les tâches sans perdre l’état', async ({ page }) => {
    await Todo.actionAppliquerFiltre(page, 'completed');
    await Todo.actionAppliquerFiltre(page, 'all');
    await Todo.verifItemPresent(page, 'Faire IHM');
    await Todo.verifItemPresent(page, 'coucou');
    await Todo.verifItemPresent(page, 'aaa');
    await Todo.verifCompteur(page, 2);
    await Todo.verifFiltreSelectionne(page, 'all');
  });
