# Formations intégrées archivées

Les onze formations d'origine, leurs leçons, missions, métadonnées, parcours et projets finaux sont conservés dans `curriculum.js`. `restore-original-script.js` est la version d'origine de l'application, avec l'affichage des formations intégrées et les parcours guidés.

## Restaurer l'application d'origine

Copie `restore-original-script.js` vers la racine du projet sous le nom `script.js`, en remplaçant le script simplifié. Le montage vide de `index.html` est compatible : l'application originale génère son contenu au démarrage.

Pour revenir à l'accueil simplifié, conserve la version courante de `script.js` (ou restaure-la depuis ta sauvegarde) et ne charge pas `restore-original-script.js`.

Les images et autres ressources des formations n'ont pas été déplacées. La progression locale est préservée pendant l'archivage et redevient exploitable avec le script d'origine.
