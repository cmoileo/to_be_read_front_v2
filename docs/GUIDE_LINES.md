Quelques guidlines pour garrantir un développement sûr et cohérent: 

Tout le code qui peut être partagé entre l'app mobile et l'app web doit être partagé.
Il faut utiliser le design pattern MVVM.
Le code doit respecter les principes SOLID.
La web paplication doit avoir toutes les données en SSR.
Le typage doit être robuste et partagé.
Tout le code doit être traduit et responsive
Il faut suivre au maximum les documentations officelles de technos utilisées, et il faut utiliser les technos suvantes: 
-   Shadcn/tailwind pour le style
-   Tanstack pour le store, routing pour l'app mobile, pour les query API, forms etc.
-   i18n pour les traductions
-   Tauri/ReactJS pour l'app mobile
-   NextJS pour la partie web