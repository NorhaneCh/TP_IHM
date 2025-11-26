import { Page, expect } from "@playwright/test";

// --- Types et Modèle ---

export interface TaskItem {
  done: boolean;
  label: string;
}

export type TaskList = TaskItem[];

// --- Lecture de l'UI ---

export async function lireListeVisible(page: Page): Promise<TaskList> {
  const lignes = page.locator(".todoapp .todo-list > li");
  const nbLignes = await lignes.count();
  const resultat: TaskList = [];

  for (let i = 0; i < nbLignes; i++) {
    const ligne = lignes.nth(i);

    // Récupérer le texte affiché de la tâche
    const labelEl = ligne.locator("label.texte");
    const texte = (await labelEl.textContent())?.trim() ?? "";

    // Récupérer l’état coché
    const coche = await ligne
      .locator("input.toggle[type=checkbox]")
      .isChecked();

    resultat.push({ label: texte, done: coche });
  }

  return resultat;
}

// --- Vérifications ---

export async function verifListeVide(page: Page): Promise<void> {
  const liste = await lireListeVisible(page);
  expect(liste.length).toBe(0);
}

export async function verifListeEgaleA(
  page: Page,
  attendu: TaskList
): Promise<void> {
  const liste = await lireListeVisible(page);
  expect(liste).toEqual(attendu);
}

// Vérifie qu’un item est présent dans la liste
export async function verifItemPresent(
  page: Page,
  label: string
): Promise<void> {
  const liste = await lireListeVisible(page);
  expect(liste.some((item) => item.label === label)).toBe(true);
}

// Vérifie qu’un item n’est pas présent dans la liste
export async function verifItemAbsent(
  page: Page,
  label: string
): Promise<void> {
  const liste = await lireListeVisible(page);
  expect(liste.every((item) => item.label !== label)).toBe(true);
}

// Vérifie si un item est coché ou non
export async function verifItemCoche(
  page: Page,
  label: string,
  attendu: boolean
): Promise<void> {
  const liste = await lireListeVisible(page);
  const item = liste.find((item) => item.label === label);
  expect(item).toBeDefined();
  expect(item!.done).toBe(attendu);
}

// Vérifie si tous les items sont cochés ou décochés
export async function verifTousCoches(
  page: Page,
  tousCoches: boolean
): Promise<void> {
  const liste = await lireListeVisible(page);
  for (const item of liste) {
    expect(item.done).toBe(tousCoches);
  }
}

// --- Vérification des filtres ---
export async function verifFiltreSelectionne(
  page: Page,
  filtre: "all" | "active" | "completed"
): Promise<void> {
  if (filtre === "all")
    await expect(page.locator(".filterAll")).toHaveClass(/selected/);
  if (filtre === "active")
    await expect(page.locator(".filterActives")).toHaveClass(/selected/);
  if (filtre === "completed")
    await expect(page.locator(".filterCompleted")).toHaveClass(/selected/);
}

// --- Vérification du compteur d'items restants ---
// export async function verifCompteur(
//   page: Page,
//   attendu: number
// ): Promise<void> {
//   await expect(page.locator(".todo-count strong")).toHaveText(
//     attendu.toString()
//   );
// }
export async function verifCompteur(
  page: Page,
  attendu: number
): Promise<void> {
  const footer = page.locator(".todo-count");

  // Si le footer n'existe pas, considérer que le compteur est 0
  if ((await footer.count()) === 0) {
    // Si on attend 0 → OK
    if (attendu === 0) return;
    // Si on attend > 0 → le footer n'existe pas donc compteur = 0
    await expect(attendu).toBe(0);
    return;
  }

  // Footer présent : lire le texte et extraire un nombre
  const texte = (await footer.textContent())?.trim() ?? "";
  const match = texte.match(/\d+/);
  const valeur = match ? parseInt(match[0], 10) : 0;

  // Vérifier que la valeur correspond à l'attendu
  await expect(valeur).toBe(attendu);
}

// --- Vérification des boutons ---
export async function verifBoutonSupprimerCocheesVisible(
  page: Page,
  visible: boolean
): Promise<void> {
  const btn = page.getByRole("button", { name: "Supprimer cochées" });
  if (visible) {
    await expect(btn).toBeVisible();
  } else {
    await expect(btn).toHaveCount(0);
  }
}

export async function verifUndoDisabled(
  page: Page,
  disabled: boolean = true
): Promise<void> {
  const btn = page.getByRole("button", { name: "Annuler" });
  if (disabled) {
    await expect(btn).toBeDisabled();
  } else {
    await expect(btn).toBeEnabled();
  }
}

export async function verifRedoDisabled(
  page: Page,
  disabled: boolean = true
): Promise<void> {
  const btn = page.getByRole("button", { name: "Refaire" });
  if (disabled) {
    await expect(btn).toBeDisabled();
  } else {
    await expect(btn).toBeEnabled();
  }
}

// --- Actions sur la liste ---

export async function actionAjouterTache(
  page: Page,
  texte: string
): Promise<void> {
  const input = page.getByPlaceholder("Que faire?");
  await input.fill(texte);
  await input.press("Enter");
}

export async function actionToutCocher(page: Page): Promise<void> {
  await page.getByText("Mark all as complete").click();
}

export async function actionCocherTache(
  page: Page,
  texte: string
): Promise<void> {
  const ligne = page.locator("li", { hasText: texte });
  await ligne.locator("input[type=checkbox]").click();
}

export async function actionSupprimerTache(
  page: Page,
  texte: string
): Promise<void> {
  const ligne = page
    .locator(".todoapp .todo-list > li", { hasText: texte })
    .first();
  await ligne.hover();
  const boutonSuppr = ligne.locator("button.destroy");
  await expect(boutonSuppr).toBeVisible();
  await boutonSuppr.click();
}

export async function actionSupprimerCochees(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Supprimer cochées" }).click();
}

export async function actionAppliquerFiltre(
  page: Page,
  filtre: "all" | "active" | "completed"
): Promise<void> {
  if (filtre === "all") await page.locator(".filterAll").click();
  if (filtre === "active") await page.locator(".filterActives").click();
  if (filtre === "completed") await page.locator(".filterCompleted").click();
}

export async function actionAnnuler(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Annuler" }).click();
}

export async function actionRefaire(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Refaire" }).click();
}

export async function verifierAnnulerDesactive(page: Page): Promise<void> {
  await expect(page.getByRole("button", { name: "Annuler" })).toBeDisabled();
}

export async function verifierRefaireDesactive(page: Page): Promise<void> {
  await expect(page.getByRole("button", { name: "Refaire" })).toBeDisabled();
}

// --- Comparaison entre Étape 1 et Étape 2 (pour vérifier cohérence) ---

export async function comparerListeAvecEtape2(page: Page): Promise<void> {
  const etape2List = page
    .getByRole("heading", { name: "Étape 2" })
    .locator("xpath=following::ul[1]");
  const tachesEtape2 = etape2List.locator("li");
  const nbTaches = await tachesEtape2.count();

  const listeEtape2: TaskList = [];
  for (let i = 0; i < nbTaches; i++) {
    const ligne = tachesEtape2.nth(i);
    const texte = (
      await ligne.locator('input[type="text"]').inputValue()
    ).trim();
    const coche = await ligne.locator('input[type="checkbox"]').isChecked();
    listeEtape2.push({ label: texte, done: coche });
  }

  const listeEtape1 = await lireListeVisible(page);

  expect(listeEtape1).toEqual(listeEtape2);
}
