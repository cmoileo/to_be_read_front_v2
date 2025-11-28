## 📖 To Read List (Liste de lecture)

Liste personnelle de livres que l'utilisateur souhaite lire plus tard.

### POST `/to-read-list`

**Authentification requise** : Oui

Ajouter un livre à sa liste de lecture.

**Body** :

```json
{
  "googleBookId": "string"
}
```

**Exemple de requête** :

```json
{
  "googleBookId": "wrOQLV6xB-wC"
}
```

**Réponse (201)** :

```json
{
  "status": "success",
  "code": "BOOK_ADDED_TO_LIST",
  "message": "Book added to your reading list",
  "item": {
    "id": 1,
    "userId": 123,
    "googleBookId": "wrOQLV6xB-wC",
    "createdAt": "2025-11-28T10:30:00.000Z"
  }
}
```

**Erreurs possibles** :

- `400 ALREADY_IN_LIST` : Ce livre est déjà dans la liste de lecture

---

### DELETE `/to-read-list`

**Authentification requise** : Oui

Retirer un livre de sa liste de lecture.

**Body** :

```json
{
  "googleBookId": "string"
}
```

**Exemple de requête** :

```json
{
  "googleBookId": "wrOQLV6xB-wC"
}
```

**Réponse (200)** :

```json
{
  "status": "success",
  "code": "BOOK_REMOVED_FROM_LIST",
  "message": "Book removed from your reading list"
}
```

**Erreurs possibles** :

- `400 NOT_IN_LIST` : Ce livre n'est pas dans la liste de lecture

---

### GET `/to-read-list/:page`

**Authentification requise** : Oui

Récupérer sa liste de lecture paginée.

**Paramètres URL** :

- `page` : Numéro de page (commence à 1)

**Exemple de requête** :

```
GET /to-read-list/1
```

**Réponse** :

```json
{
  "data": [
    {
      "id": 1,
      "googleBookId": "wrOQLV6xB-wC",
      "createdAt": "2025-11-28T10:30:00.000Z",
      "book": {
        "id": "wrOQLV6xB-wC",
        "volumeInfo": {
          "title": "Harry Potter and the Philosopher's Stone",
          "authors": ["J.K. Rowling"],
          "description": "Description...",
          "imageLinks": {
            "thumbnail": "url_image"
          },
          "publishedDate": "1997",
          "pageCount": 309
        }
      }
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
