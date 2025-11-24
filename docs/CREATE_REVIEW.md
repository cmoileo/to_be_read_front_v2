# Documentation API - ToBeRead

## 🔍 Recherche de livres

### GET `/books`

**Authentification requise** : Oui

Recherche des livres via l'API Google Books.

**Query Parameters** :

```json
{
  "q": "string (2-100 caractères)",
  "page": "number (1-100, optionnel, défaut: 1)",
  "limit": "number (1-20, optionnel, défaut: 10)"
}
```

**Exemple de requête** :

```
GET /books?q=harry+potter&page=1&limit=10
```

**Réponse** :

```json
{
  "items": [
    {
      "id": "googleBookId",
      "volumeInfo": {
        "title": "Titre du livre",
        "authors": ["Auteur 1", "Auteur 2"],
        "description": "Description...",
        "imageLinks": {
          "thumbnail": "url_image"
        },
        "publishedDate": "2023",
        "pageCount": 350
      }
    }
  ],
  "totalItems": 100
}
```

---

## 📝 Publication de reviews

### POST `/reviews`

**Authentification requise** : Oui

Créer une review pour un livre.

**Body** :

```json
{
  "content": "string (3-1000 caractères)",
  "value": "number (1-10)",
  "googleBookId": "string"
}
```

**Exemple de requête** :

```json
{
  "content": "Un livre absolument incroyable ! L'histoire est captivante du début à la fin.",
  "value": 9,
  "googleBookId": "wrOQLV6xB-wC"
}
```

**Réponse** :

```json
{
  "review": {
    "id": 123,
    "content": "Un livre absolument incroyable !...",
    "value": 9,
    "googleBookId": "wrOQLV6xB-wC",
    "userId": 456,
    "createdAt": "2025-11-24T10:30:00.000Z",
    "updatedAt": "2025-11-24T10:30:00.000Z"
  }
}
```

---

## 📚 Récupération de reviews

### GET `/review/:id`

**Authentification requise** : Non (optionnelle)

Récupérer une review spécifique par son ID.

**Paramètres** :

- `id` : ID de la review

**Réponse** :

```json
{
  "id": 123,
  "content": "Contenu de la review",
  "value": 9,
  "googleBookId": "wrOQLV6xB-wC",
  "userId": 456,
  "user": {
    "id": 456,
    "userName": "john_doe",
    "avatarUrl": "url"
  },
  "likesCount": 15,
  "commentsCount": 3,
  "isLiked": true,
  "createdAt": "2025-11-24T10:30:00.000Z"
}
```

### GET `/user/:id/reviews/:page`

**Authentification requise** : Oui

Récupérer toutes les reviews d'un utilisateur spécifique.

**Paramètres** :

- `id` : ID de l'utilisateur
- `page` : Numéro de page

**Réponse** :

```json
{
  "data": [
    {
      "id": 123,
      "content": "Contenu...",
      "value": 9,
      "googleBookId": "xxx",
      "likesCount": 15,
      "commentsCount": 3
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 5,
    "total": 50
  }
}
```

### GET `/popular-reviews/:page`

**Authentification requise** : Non

Récupérer les reviews populaires (triées par nombre de likes).

**Paramètres** :

- `page` : Numéro de page

**Réponse** : Même format que `/user/:id/reviews/:page`

### GET `/feed/:page`

**Authentification requise** : Oui

Récupérer le feed personnalisé (reviews des utilisateurs suivis).

**Paramètres** :

- `page` : Numéro de page

**Réponse** : Même format que `/user/:id/reviews/:page`

---

## 👍 Interactions avec les reviews

### GET `/review/:id/like`

**Authentification requise** : Oui

Liker ou unliker une review.

**Paramètres** :

- `id` : ID de la review

**Réponse** :

```json
{
  "liked": true,
  "likesCount": 16
}
```

### DELETE `/review/:id`

**Authentification requise** : Oui (et être l'auteur)

Supprimer une review.

**Paramètres** :

- `id` : ID de la review

**Réponse** :

```json
{
  "status": "success",
  "code": "REVIEW_DELETED",
  "message": "Review supprimée avec succès"
}
```

---

## 💬 Commentaires

### POST `/comment`

**Authentification requise** : Oui

Créer un commentaire sur une review.

**Body** :

```json
{
  "content": "string (3-500 caractères)",
  "reviewId": "number"
}
```

**Réponse** :

```json
{
  "comment": {
    "id": 789,
    "content": "Excellent point de vue !",
    "reviewId": 123,
    "userId": 456,
    "createdAt": "2025-11-24T10:35:00.000Z"
  }
}
```

### GET `/comments/:id/:page`

**Authentification requise** : Oui

Récupérer les commentaires d'une review.

**Paramètres** :

- `id` : ID de la review
- `page` : Numéro de page

### GET `/comment/:id/like`

**Authentification requise** : Oui

Liker ou unliker un commentaire.

### DELETE `/comment/:id`

**Authentification requise** : Oui (et être l'auteur)

Supprimer un commentaire.

---

## 🔐 Headers requis

Pour les routes authentifiées, inclure :

```
Authorization: Bearer <token>
```
