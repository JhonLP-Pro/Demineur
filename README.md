# Démineur

Un jeu de démineur classique développé en HTML, CSS et JavaScript vanilla, avec support du mode sombre/clair et une interface responsive.

## 🎮 Fonctionnalités

- 3 niveaux de difficulté :
  - Facile (9x9, 10 mines)
  - Moyen (16x16, 40 mines)
  - Difficile (16x30, 99 mines)
- Mode sombre/clair
- Design responsive
- Compteur de mines
- Chronomètre
- Support tactile et souris

## 🎯 Comment jouer

1. Clic gauche : Révéler une case
2. Clic droit : Placer/Retirer un drapeau
3. Le premier clic est toujours sûr
4. Les chiffres indiquent le nombre de mines adjacentes
5. Marquez toutes les mines avec des drapeaux pour gagner

## 🛠️ Structure du code

### HTML (index.html)
```html
Structure principale du jeu avec :
- En-tête (titre, contrôles)
- Grille de jeu
- Modal de fin de partie
```

### CSS (style.css)
```css
Styles avec :
- Variables CSS pour les thèmes
- Design responsive
- Animations
- Personnalisation de la barre de défilement
- Media queries pour différentes tailles d'écran
```

### JavaScript (script.js)
```javascript
Classe Minesweeper qui gère :
- Logique du jeu
- Génération de la grille
- Placement des mines
- Gestion des événements
- Calcul des nombres
- Système de victoire/défaite
```

## 📱 Responsive Design

Le jeu s'adapte automatiquement à différentes tailles d'écran :
- Desktop : Affichage complet
- Tablette : Grille redimensionnée
- Mobile : Interface adaptée avec contrôles empilés

## 🎨 Thèmes

### Mode Clair
- Fond clair
- Texte sombre
- Grille aux tons gris clair

### Mode Sombre
- Fond sombre
- Texte clair
- Grille aux tons gris foncé

## 🔧 Détails techniques

### Variables CSS
```css
:root {
    --bg-color: #ffffff;
    --text-color: #333333;
    /* ... autres variables ... */
}
```

### Gestion de la grille
```javascript
- Système de coordonnées (row, col)
- Calcul des mines adjacentes
- Révélation récursive des cases vides
```

### Gestion des événements
```javascript
- Clic gauche/droit
- Changement de difficulté
- Changement de thème
- Nouvelle partie
```

## 🌟 Fonctionnalités avancées

1. Protection premier clic
   - Les mines sont placées après le premier clic
   - Garantit que le premier clic est toujours sûr

2. Révélation intelligente
   - Révèle automatiquement les cases vides adjacentes
   - Optimisé pour éviter les boucles infinies

3. Gestion de l'état du jeu
   - Suivi des mines restantes
   - Chronomètre
   - Détection de victoire/défaite

4. Interface adaptative
   - Barre de défilement personnalisée
   - Grille responsive
   - Support multi-périphériques

## 📈 Améliorations possibles

1. Ajout de statistiques de jeu
2. Système de high scores
3. Animations supplémentaires
4. Mode personnalisé
5. Sauvegarde des préférences

## 🔍 Utilisation du code

1. Clonez le repository
2. Ouvrez index.html dans un navigateur
3. Commencez à jouer !

## 🤝 Contribution

N'hésitez pas à contribuer au projet en :
1. Fork du repository
2. Création d'une branche pour vos modifications
3. Soumission d'une pull request

## 📝 Licence

Ce projet est sous licence libre et peut être utilisé comme base d'apprentissage ou pour développer votre propre version du jeu.
