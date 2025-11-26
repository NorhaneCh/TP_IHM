# TP IHM – Rapport des Tests Réalisés

### Binôme

- **Norhane CHERIF**
- **Lina GANA**

LE MODELE DE TACHE EST DANS LE DOSSIER 'Modele_de_tache'

## 1. ✔️ Tests : Ajout et affichage des tâches

- Saisir une tâche dans le champ d’entrée puis valider (Enter ou bouton) ajoute correctement une nouvelle tâche en bas de la liste.
- Ajout de plusieurs tâches successives :  
  Exemples testés : _« Faire IHM »_, _« coucou »_, _« aaa »_, _« alloo »_.  
  → L’ordre d’affichage respecte l’ordre d’ajout.
- Vérification du compteur « X restantes » :  
  → Le nombre affiché correspond exactement au nombre de tâches **actives**.

## 2. ✔️ Tests : Gestion des tâches individuelles

- Cliquer sur l’icône/case « complete » marque correctement la tâche comme complétée (style barré ou modifié).
- La complétion décrémente le compteur.
- Un second clic remet la tâche en état **active** ; le compteur s’incrémente.
- La suppression d’une tâche via l’icône poubelle/croix la retire de la liste et met à jour le compteur.

## 3. ✔️ Tests : Bouton « Mark all as complete »

- Cliquer sur **Mark all as complete** marque toutes les tâches comme complétées.
  → Le compteur affiche **0**.
- Lorsque toutes les tâches sont déjà complétées :  
  → Un nouveau clic remet toutes les tâches en **actives** et met à jour le compteur.

## 4. 🧹 Tests : Suppression des tâches complétées

- Le bouton **Clear completed** supprime uniquement les tâches terminées.
- Vérification que les tâches actives restent intactes.
- Le compteur se met à jour correctement.

## 5. 📁 Tests : Filtres (Tous / Actifs / Complétés)

- **Tous** : affiche l’ensemble des tâches sans distinction.
- **Actifs** : affiche uniquement les tâches non complétées et compteur cohérent.
- **Complétés** : affiche uniquement les tâches terminées.
- Revenir sur **Tous** : restauration de l’affichage complet sans perte d’état.

## 6. 🕓 Tests bonus : Annuler / Refaire

- Après chaque action (ajout, suppression, completion, Mark all), le bouton **Annuler** restaure exactement l’état précédent (liste, compteur, filtre).
- Après un « Annuler », le bouton **Refaire** rejoue l’action annulée.
- Séquence testée :
  1. Ajouter 3 tâches
  2. En compléter une
  3. En supprimer une
  4. Cliquer plusieurs fois sur Annuler  
     → L’historique se déroule dans le bon ordre.
- Refaire rejoue correctement chaque étape.

## 7. ⌨️ Tests : Raccourcis clavier CTRL+Z / CTRL+Y

- **CTRL+Z** : même effet que **Annuler**.
- **CTRL+Y** : même effet que **Refaire**.
- Vérification que les raccourcis ne déclenchent rien lorsque l’action n’est pas possible :  
  → Aucun crash, aucune erreur dans la console.

## 8. 🎨 Tests : Comportement UI et états désactivés

- Vérification de l’état **désactivé** des boutons :
  - Annuler
  - Refaire
  - Clear completed  
    lorsqu’aucune action n’est disponible.
- Les boutons désactivés sont visuellement différents et ne déclenchent aucune action.
- Aucune erreur visible dans la console JavaScript lors des interactions.
