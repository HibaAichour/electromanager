# ElectroManager

Plateforme de gestion multi-magasins pour la vente d'articles électroniques (smartphones, ordinateurs, tablettes, montres connectées, accessoires), avec un assistant intelligent intégré pour interroger les données en langage naturel.

## Aperçu

ElectroManager centralise la gestion de plusieurs magasins : suivi des stocks, des ventes, des produits par catégorie, et alertes automatiques en cas de rupture. Un chatbot basé sur l'IA (Groq) permet aux utilisateurs de poser des questions directement sur les données du magasin ("Quels produits ont un stock bas ?", "Quel est le prix de l'iPhone 14 Pro ?") et d'obtenir une réponse claire, générée à partir des données réelles de la base.

## Fonctionnalités

- **Tableau de bord** : vue d'ensemble des ventes du jour, des revenus, et des alertes de stock bas
- **Gestion des produits** : création, modification et catégorisation des articles, avec suivi du stock et du prix
- **Gestion multi-magasins** : suivi indépendant par point de vente
- **Assistant IA intégré** : chatbot conversationnel connecté en temps réel à la base de données, pour des réponses précises sans écrire de requête SQL
- **Interface d'administration** : gestion des utilisateurs, produits et catégories via l'admin Django

## Stack technique

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS

**Backend**
- Django (API REST pour les produits et le catalogue)
- Node.js / Express (proxy sécurisé vers l'API Groq)
- SQLite (base de données de développement)

**Intelligence artificielle**
- Groq API (modèle `openai/gpt-oss-20b`) pour l'assistant conversationnel

## Architecture

```
simpliculinary/
├── backend/              # API Django + serveur Express
│   ├── backend/          # Configuration du projet Django
│   ├── products/         # App Django : produits et catégories
│   ├── users/            # App Django : utilisateurs
│   ├── orders/           # App Django : commandes
│   ├── cart/             # App Django : panier
│   └── server.js         # Serveur Express (proxy API)
└── frontend/             # Application React
    └── src/
        ├── app/
        │   ├── components/   # Composants réutilisables (dont l'assistant IA)
        │   ├── pages/         # Pages de l'application
        │   └── hooks/         # Hooks personnalisés
        └── services/          # Appels aux services externes
```

## Installation

### Prérequis
- Node.js (v18 ou plus)
- Python 3.13
- Une clé API Groq ([console.groq.com](https://console.groq.com))

### Backend (Django)

```bash
cd backend
python3 -m pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```
L'API est accessible sur `http://localhost:8000`.

### Backend (Express, proxy Groq)

```bash
cd backend
npm install
node server.js
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
L'application est accessible sur `http://localhost:5173`.

### Variables d'environnement

Créez un fichier `.env` dans `frontend/` :
```
VITE_GROQ_API_KEY=votre_clé_api_groq
```

Créez un fichier `.env` dans `backend/` :
```
GROQ_API_KEY=votre_clé_api_groq
PORT=3001
```

## Auteur

Développé par **Hiba Aichour**

## Licence

Ce projet est distribué sous licence MIT.
