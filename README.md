install  nest 
- npm install -g @nestjs/cli

creer fichier nest
- nest new plateforme

choix de package manager
npm
with vitest

"Installer les dépendances indispensables pour l'authentification (JWT, bcrypt), la validation des données et la base de données (exemple ici avec PostgreSQL + TypeORM, qui est très robuste avec NestJS) :"

npm install @nestjs/typeorm typeorm pg bcrypt @nestjs/jwt @nestjs/config class-validator class-transformer
npm install --save-dev @types/bcrypt

Installer Vitest et le plugin de couverture de code :bashnpm install --save-dev vitest @vitest/coverage-v8 unplugin-swc

Base de données PostgreSQL

creer module auths :
-nest g module auth                 
-nest g controller auth                                                                    
-nest g service auth                                                                 
et creer des dossier dto , guards ,strategies dans ../auth

creer module users:
-nest g module users 
-nest g service users
 
et creer dossier entities dans ../users

Activer le service de fichiers statiques:
-npm install @nestjs/serve-static

