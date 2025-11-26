import { test, expect } from '@playwright/test';
import { 
  actionAjouterTache, 
  lireListeVisible,
  verifListeEgaleA, 
  verifItemPresent,  
  verifCompteur 
} from './modelsTodo'; 

// --- Test 1 : Ajout d’une tâche et vérification de sa présence ---
test('Ajouter une tâche', async ({ page }) => {
  await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/'); 

  const texte = 'Faire IHM';
  await actionAjouterTache(page, texte);

  // Vérification que la tâche est présente
  await verifItemPresent(page, texte);
});

// --- Test 2 : Ajout de plusieurs tâches et vérification de l’ordre ---
test('Ajouter plusieurs tâches et vérifier l’ordre', async ({ page }) => { 
  await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');

  const taches = ['coucou', 'aaa', 'alloo'];
  for (const t of taches) {
    await actionAjouterTache(page, t);
  }
  const attendu = taches.map(label => ({ label, done: false }));
  //vérifie que la liste est égale à la liste attendue
  await verifListeEgaleA(page, attendu);
});

// --- Test 3 : Vérification du compteur de tâches restantes ---
test('Compteur affiche le nombre exact de tâches non complétées', async ({ page }) => {
  await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');

  // Suppose qu’on ajoute 4 tâches
  const taches = ['Faire IHM', 'coucou', 'aaa', 'alloo'];
  for (const t of taches) {
    await actionAjouterTache(page, t);
  }

  // Vérifie que le compteur affiche 4
  await verifCompteur(page, 4);
});