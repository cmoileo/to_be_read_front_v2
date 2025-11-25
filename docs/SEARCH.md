# Documentation API - ToBeRead

## 🔍 Recherche globale et recherche détaillée

### GET `/search`

**Authentification requise** : Oui

Recherche globale qui retourne les 5 premiers résultats de chaque catégorie (users, livres, reviews).

**Query Parameters** :

```json
{
  "q": "string (2-100 caractères)"
}
```

**Exemple de requête** :

```
GET /search?q=harry+potter
```

**Réponse** :

```json
{
  "users": [
    {
      "id": 1,
      "userName": "harrypotterfan",
      "biography": "Fan de Harry Potter...",
      "avatarUrl": "url"
    }
  ],
  "books": [
    {
      "id": "googleBookId",
      "volumeInfo": {
        "title": "Harry Potter and the Philosopher's Stone",
        "authors": ["J.K. Rowling"],
        "description": "Description...",
        "imageLinks": {
          "thumbnail": "url_image"
        }
      }
    }
  ],
  "reviews": [
    {
      "id": 123,
      "content": "Un livre incroyable sur Harry Potter...",
      "value": 9,
      "googleBookId": "xxx",
      "author": {
        "id": 1,
        "userName": "john_doe",
        "avatarUrl": "url"
      },
      "book": { ... },
      "likesCount": 15,
      "commentsCount": 3
    }
  ]
}
```

---

### GET `/search/users`

**Authentification requise** : Oui

Recherche paginée d'utilisateurs.

**Query Parameters** :

```json
{
  "q": "string (2-50 caractères)",
  "page": "number (1-100, optionnel, défaut: 1)",
  "limit": "number (1-20, optionnel, défaut: 10)"
}
```

**Exemple de requête** :

```
GET /search/users?q=john&page=1&limit=10
```

**Réponse** :

```json
{
  "data": [
    {
      "id": 1,
      "userName": "john_doe",
      "biography": "Passionné de lecture",
      "avatarUrl": "url"
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 3,
    "total": 25,
    "perPage": 10
  }
}
```

---

### GET `/search/books`

**Authentification requise** : Oui

Recherche paginée de livres via l'API Google Books.

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
GET /search/books?q=tolkien&page=1&limit=10
```

**Réponse** :

```json
{
  "data": [
    {
      "id": "googleBookId",
      "volumeInfo": {
        "title": "The Lord of the Rings",
        "authors": ["J.R.R. Tolkien"],
        "description": "Description...",
        "imageLinks": {
          "thumbnail": "url_image"
        },
        "publishedDate": "1954",
        "pageCount": 1178
      }
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 50,
    "total": 500,
    "perPage": 10
  }
}
```

---

### GET `/search/reviews`

**Authentification requise** : Oui

Recherche paginée de reviews basée sur leur contenu.

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
GET /search/reviews?q=incroyable&page=1&limit=10
```

**Réponse** :

```json
{
  "data": [
    {
      "id": 123,
      "content": "Un livre absolument incroyable !...",
      "value": 9,
      "googleBookId": "wrOQLV6xB-wC",
      "createdAt": "2025-11-24T10:30:00.000Z",
      "author": {
        "id": 456,
        "userName": "john_doe",
        "avatarUrl": "url"
      },
      "book": {
        "title": "Titre du livre",
        "authors": ["Auteur"],
        "imageLinks": {
          "thumbnail": "url"
        }
      },
      "likesCount": 15,
      "commentsCount": 3
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 5,
    "total": 48,
    "perPage": 10
  }
}
```

---

## 🔍 Recherche de livres (ancienne route)

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
