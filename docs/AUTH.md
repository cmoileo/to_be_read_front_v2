# Documentation d'Authentification API

## Vue d'ensemble

L'API utilise un système d'authentification basé sur des **Access Tokens** et des **Refresh Tokens** pour sécuriser les endpoints.

- **Access Token** : Token de courte durée utilisé pour authentifier les requêtes API
- **Refresh Token** : Token de longue durée (30 jours) utilisé pour renouveler l'access token

## Flow d'Authentification

```
1. Login/Register → Obtenir access_token + refresh_token
2. Utiliser access_token dans les requêtes API
3. Si access_token expire → Utiliser refresh_token pour obtenir un nouveau access_token
4. Si refresh_token expire → L'utilisateur doit se reconnecter
```

## Endpoints

### 1. Inscription

**POST** `/register`

Crée un nouveau compte utilisateur.

**Body:**
```json
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "userName": "john_doe"
  },
  "token": {
    "type": "bearer",
    "value": "oat_xxx...",
    "expiresAt": "2025-11-24T12:00:00.000Z"
  },
  "refreshToken": "abc123def456..."
}
```

---

### 2. Connexion

**POST** `/login`

Authentifie un utilisateur existant.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

OU

```json
{
  "userName": "john_doe",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "userName": "john_doe"
  },
  "token": {
    "type": "bearer",
    "value": "oat_xxx...",
    "expiresAt": "2025-11-24T12:00:00.000Z"
  },
  "refreshToken": "abc123def456..."
}
```

---

### 3. Rafraîchir le Token

**POST** `/refresh`

Obtient un nouveau access token en utilisant un refresh token valide.

**Body:**
```json
{
  "refreshToken": "abc123def456..."
}
```

**Response (200):**
```json
{
  "token": {
    "type": "bearer",
    "value": "oat_new...",
    "expiresAt": "2025-11-24T13:00:00.000Z"
  },
  "refreshToken": "xyz789new..."
}
```

**Note:** Un nouveau refresh token est également généré pour renforcer la sécurité (rotation des tokens).

---

### 4. Révoquer le Refresh Token

**POST** `/revoke-refresh-token`

Révoque un refresh token (nécessite authentification).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "refreshToken": "abc123def456..."
}
```

**Response (200):**
```json
{
  "status": "success",
  "code": "REFRESH_TOKEN_REVOKED",
  "message": "Refresh token revoked successfully"
}
```

---

### 5. Déconnexion

**POST** `/logout`

Déconnecte l'utilisateur (révoque l'access token actuel).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Utilisation des Tokens

### Stocker les Tokens

**Recommandations de sécurité:**

1. **Access Token:** Stocker en mémoire (variable JavaScript) ou dans sessionStorage
2. **Refresh Token:** Stocker de manière sécurisée (pas dans localStorage si possible)

```javascript
// Exemple de stockage sécurisé
class AuthManager {
  private accessToken: string | null = null;
  
  // Stocker en mémoire
  setAccessToken(token: string) {
    this.accessToken = token;
  }
  
  // Refresh token stocké de manière sécurisée
  setRefreshToken(token: string) {
    // Option 1: HttpOnly cookie (backend)
    // Option 2: Secure storage natif (mobile)
    // Option 3: sessionStorage (moins sécurisé mais acceptable)
    sessionStorage.setItem('refresh_token', token);
  }
}
```

---

### Authentifier les Requêtes

Pour accéder aux endpoints protégés, incluez l'access token dans le header:

```javascript
fetch('https://api.example.com/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
```

---

### Gestion de l'Expiration du Token

Implémentez un intercepteur pour gérer automatiquement le renouvellement:

```javascript
async function fetchWithAuth(url, options = {}) {
  // Première tentative avec l'access token actuel
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // Si 401 Unauthorized avec code UNAUTHENTICATED
  if (response.status === 401) {
    const error = await response.json();
    
    if (error.code === 'UNAUTHENTICATED') {
      // Tenter de rafraîchir le token
      const refreshResponse = await fetch('/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (refreshResponse.ok) {
        const { token, refreshToken: newRefreshToken } = await refreshResponse.json();
        
        // Mettre à jour les tokens
        accessToken = token.value;
        refreshToken = newRefreshToken;
        
        // Réessayer la requête originale
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } else {
        // Refresh token invalide/expiré → Rediriger vers login
        redirectToLogin();
      }
    }
  }

  return response;
}
```

---

## Codes d'Erreur

Tous les endpoints renvoient des erreurs au format standardisé:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Description traduite de l'erreur"
}
```

### Codes d'Erreur d'Authentification

| Code | Status | Description |
|------|--------|-------------|
| `EMAIL_OR_USERNAME_IN_USE` | 400 | Email ou nom d'utilisateur déjà utilisé |
| `REGISTRATION_FAILED` | 500 | Erreur lors de la création du compte |
| `EMAIL_OR_USERNAME_REQUIRED` | 400 | Email ou username manquant |
| `INVALID_CREDENTIALS` | 401 | Identifiants invalides |
| `UNAUTHENTICATED` | 401 | Token manquant ou invalide |
| `REFRESH_TOKEN_REQUIRED` | 400 | Refresh token manquant |
| `REFRESH_TOKEN_EXPIRED` | 401 | Refresh token expiré |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token invalide |
| `USERNAME_IN_USE` | 500 | Nom d'utilisateur déjà pris |

---

## Internationalisation (i18n)

L'API supporte plusieurs langues pour les messages d'erreur. Langues disponibles: `en`, `fr`

### Définir la Langue par Défaut

Envoyez le header `Accept-Language` dans vos requêtes:

```javascript
fetch('/api/endpoint', {
  headers: {
    'Accept-Language': 'fr',
    'Authorization': `Bearer ${token}`
  }
})
```

### Langue de l'Utilisateur

Chaque utilisateur a une langue préférée stockée en base de données:

- **Au Register:** La langue est automatiquement détectée depuis le header `Accept-Language`
- **Modification:** Utilisez l'endpoint `PUT /me` pour changer la langue

```json
{
  "locale": "fr"
}
```

Les erreurs seront automatiquement traduites dans la langue de l'utilisateur.

---

## Sécurité

### Bonnes Pratiques

1. **Ne jamais exposer les tokens dans les URLs**
2. **Toujours utiliser HTTPS en production**
3. **Implémenter la rotation des refresh tokens** (déjà fait par l'API)
4. **Définir des délais d'expiration appropriés:**
   - Access Token: Courte durée (par défaut AdonisJS)
   - Refresh Token: 30 jours
5. **Révoquer les tokens lors de la déconnexion**
6. **Valider les tokens côté backend à chaque requête**

### Gestion des Refresh Tokens Compromis

Si un refresh token est compromis:

1. L'utilisateur peut le révoquer via `/revoke-refresh-token`
2. L'administrateur peut supprimer manuellement les tokens en base de données
3. Les anciens refresh tokens sont automatiquement invalidés après utilisation (rotation)

---