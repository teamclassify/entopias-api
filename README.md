# Entopias API

## Tecnologias utilizadas

- Node.js
- Express
- Prisma: ORM para base de datos. [Documentacion](https://www.prisma.io/docs/)
- PostgreSQL: Base de datos
- JWT: Autenticacion
- Firebase: Authenticacion y almacenamiento de imagenes. [Documentacion](https://firebase.google.com/docs)

## Comenzar

1. Clonar el repositorio
```bash
git clone repo
```
2. Instalar dependencias
```bash
npm install
```
3. Crear un archivo .env en la raiz del proyecto con las variables de entorno
4. Correr el servidor en modo desarrollo
```bash
npm run dev
```

## Como trabajar en el proyecto

1. Crear una rama con el nombre de la tarea que se va a realizar
2. Hacer los cambios necesarios
3. Hacer commit de los cambios
```bash
git add .
git commit -m "mensaje"
```
4. Subir los cambios a la rama
```bash
git push origin nombre-de-la-rama
```
5. Crear un pull request en github
6. Esperar a que el pull request sea aprobado


## Como crear un nuevo modelo

1. Modificar el archivo `prisma/schema.prisma`
2. Crear una migracion
```bash
npx prisma migrate dev --name nombre-de-la-migracion
```
3. Crear el servicio en `src/services` para hacer las operaciones con la base de datos

## Como crear un nuevo endpoint

1. Crear un archivo en la carpeta `src/routes` con el nombre del recurso
2. Crear las rutas necesarias
3. Importar el archivo en `src/index.js`
4. Crear un archivo en la carpeta `src/controllers` con el nombre del recurso
5. Crear las funciones necesarias
6. Importar el archivo en el archivo de rutas
7. Crear un archivo en la carpeta `src/services` con el nombre del recurso
8. Crear las funciones necesarias
9. Importar el archivo en el archivo de controladores


## Base de datos

1. Crear migracion (cuando se cambia un modelo): `npx prisma migrate dev --name nombre-de-la-migracion`
