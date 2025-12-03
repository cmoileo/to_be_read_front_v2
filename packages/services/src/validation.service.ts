export class ValidationService {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un caractère spécial");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 32 && /^[a-zA-Z0-9_]+$/.test(username);
  }

  static validateReviewRating(value: number): boolean {
    // Rating is now 0.5 to 5 with half-star increments
    return value >= 0.5 && value <= 5 && (value * 2) % 1 === 0;
  }
}
