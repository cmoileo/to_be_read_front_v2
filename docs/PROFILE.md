# Profile API Documentation

## Get Profile

Récupère les informations du profil de l'utilisateur connecté.

**Route:** `GET /me`

**Authentication:** Required (Bearer token)

**Réponse:**
```json
{
  "user": {
    "id": 1,
    "userName": "john_doe",
    "email": "john@example.com",
    "biography": "Developer & book lover",
    "avatarUrl": "https://...",
    "followersCount": 42,
    "followingCount": 15,
    "reviewsCount": 28
  }
}
```

---

## Update Profile

Met à jour les informations du profil de l'utilisateur connecté.

**Route:** `PUT /me`

**Authentication:** Required (Bearer token)

**Paramètres d'entrée (multipart/form-data):**
- `userName` (string, optional): Nouveau nom d'utilisateur
- `biography` (string, optional): Biographie (peut être vide)
- `locale` (string, optional): Langue préférée (`en` ou `fr`)
- `avatar` (file, optional): Photo de profil (jpg, jpeg, png, webp, max 2MB)

**Réponse:**
```json
{
  "user": {
    "id": 1,
    "userName": "john_doe",
    "email": "john@example.com",
    "biography": "Updated bio",
    "avatarUrl": "https://..."
  }
}
```

**Erreurs possibles:**
- `400 USERNAME_IN_USE`: Le nom d'utilisateur est déjà pris
- `500 AVATAR_UPLOAD_FAILED`: Erreur lors de l'upload de l'avatar

---

## Get My Reviews

Récupère toutes les reviews de l'utilisateur connecté avec pagination.

**Route:** `GET /my-reviews/:page`

**Authentication:** Required (Bearer token)

**Paramètres d'URL:**
- `page` (number): Numéro de la page (commence à 1)

**Réponse:**
```json
{
  "meta": {
    "total": 28,
    "perPage": 10,
    "currentPage": 1,
    "lastPage": 3,
    "firstPage": 1,
    "firstPageUrl": "/?page=1",
    "lastPageUrl": "/?page=3",
    "nextPageUrl": "/?page=2",
    "previousPageUrl": null
  },
  "data": [
    {
      "id": 1,
      "content": "Amazing book!",
      "value": 5,
      "googleBookId": "abc123",
      "createdAt": "2025-11-24T10:00:00.000Z",
      "book": {
        "id": "abc123",
        "title": "The Great Gatsby",
        "authors": ["F. Scott Fitzgerald"],
        "thumbnail": "https://...",
        "description": "...",
        "publishedDate": "1925",
        "pageCount": 180,
        "categories": ["Fiction"]
      }
    }
  ]
}
```

---

## Get User Reviews

Récupère toutes les reviews d'un utilisateur spécifique avec pagination.

**Route:** `GET /user/:id/reviews/:page`

**Authentication:** Required (Bearer token)

**Paramètres d'URL:**
- `id` (number): ID de l'utilisateur
- `page` (number): Numéro de la page (commence à 1)

**Réponse:**
```json
{
  "meta": {
    "total": 28,
    "perPage": 10,
    "currentPage": 1,
    "lastPage": 3,
    "firstPage": 1,
    "firstPageUrl": "/?page=1",
    "lastPageUrl": "/?page=3",
    "nextPageUrl": "/?page=2",
    "previousPageUrl": null
  },
  "data": [
    {
      "id": 1,
      "content": "Amazing book!",
      "value": 5,
      "googleBookId": "abc123",
      "createdAt": "2025-11-24T10:00:00.000Z",
      "book": {
        "id": "abc123",
        "title": "The Great Gatsby",
        "authors": ["F. Scott Fitzgerald"],
        "thumbnail": "https://...",
        "description": "...",
        "publishedDate": "1925",
        "pageCount": 180,
        "categories": ["Fiction"]
      }
    }
  ]
}
```

**Note:** Par défaut, 10 reviews par page.
