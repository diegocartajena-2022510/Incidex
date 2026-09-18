# Incidex

Sistema de Gestión de Incidencias

Incidex es un sistema web diseñado para facilitar el registro, seguimiento y administración de incidencias en Fundación Kinal.

La plataforma permite centralizar los reportes de problemas que anteriormente podían comunicarse mediante llamadas telefónicas o mensajes, organizándolos en un solo sistema para facilitar su clasificación, asignación, atención y resolución.

El proyecto fue desarrollado como una propuesta tecnológica para mejorar la comunicación entre los usuarios y las áreas responsables de atender las incidencias.

Descripción del proyecto

Incidex permite gestionar incidencias reportadas por los usuarios de una institución, proporcionando información sobre su estado, prioridad, ubicación, categoría y responsable de atención.
El sistema busca mejorar la organización de los reportes y evitar que las incidencias se pierdan entre diferentes medios de comunicación.
Entre las principales funciones desarrolladas se encuentran:
-Registro e inicio de sesión de usuarios.
-Gestión de usuarios y roles.
-Registro de incidencias.
-Clasificación de incidencias por categorías.
-Asignación de incidencias a responsables.
-Gestión de prioridades.
-Actualización del estado de las incidencias.
-Consulta y búsqueda de incidencias.
-Registro de comentarios y observaciones.
-Adjuntar evidencias a las incidencias.
-Historial de cambios.
-Notificaciones.
-Panel principal con información resumida.
-Administración de catálogos del sistema.

Objetivo general
Desarrollar un sistema web que permita centralizar y organizar el reporte de incidencias, facilitando su registro, asignación, seguimiento y resolución por parte de las diferentes áreas responsables.
Objetivos específicos
Centralizar los reportes de problemas en una sola plataforma.
Facilitar el registro de incidencias por parte de los usuarios.
Permitir clasificar las incidencias según su categoría.
Asignar los reportes al área o responsable correspondiente.
Permitir consultar el estado de cada incidencia.
Mantener un historial de los cambios realizados.
Facilitar la administración de usuarios y permisos.
Proporcionar información que ayude al seguimiento de los problemas reportados.

Usuarios del sistema
Incidex contempla diferentes tipos de usuarios, cada uno con funciones específicas:
Rol	Función principal
Administrador	Gestionar usuarios, incidencias, categorías, prioridades y demás configuraciones del sistema.
Profesor	Registrar incidencias y consultar el seguimiento de sus reportes.
Personal TICS	Atender incidencias relacionadas con tecnología y equipos informáticos.
Personal Servicios	Atender problemas relacionados con limpieza y servicios generales.
Personal Infraestructura	Atender problemas relacionados con infraestructura y mobiliario.
Esto permite conocer en qué etapa se encuentra cada reporte.

Arquitectura del sistema
El proyecto utiliza una arquitectura de tres componentes principales:
     
El frontend no se conecta directamente con la base de datos. Las operaciones son realizadas mediante la API desarrollada en el backend.

Tecnologías utilizadas:
*Frontend
*Angular 22
*TypeScript
*HTML5
*CSS3
*RxJS
*Angular Router
*Reactive Forms
*Backend
*Node.js
*Express
*TypeScript
*JWT (JSON Web Token)
*Multer
*CORS
*dotenv
*Base de datos
*PostgreSQL

La base de datos contiene las principales entidades necesarias para el funcionamiento del sistema, entre ellas:
-Login
-Usuarios
-Departamentos
-Categorías
-Ubicaciones
-Prioridades
-Incidencias
-Asignaciones
-Comentarios
-Historial de incidencias
-Adjuntos
-Notificaciones
-Herramientas utilizadas
-Visual Studio Code
-Git
-GitHub
-PostgreSQL
-Navegador web
-Herramientas de diseño y documentación

Instalación y configuración
1. Requisitos previos
Antes de ejecutar el proyecto es necesario tener instalado:
Node.js
npm
Angular CLI
PostgreSQL
Git
Visual Studio Code
Se recomienda utilizar versiones compatibles con las dependencias indicadas en los archivos package.json.

2. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
Ingresar a la carpeta:
cd Incidex-develop
-Configuración de PostgreSQL
-Crear una base de datos en PostgreSQL con el nombre:
-dbgestionincidencias_postgresql
-Posteriormente, ejecutar el archivo:
dbgestionincidencias_postgresql.sql
Este archivo contiene la estructura de la base de datos y los datos iniciales necesarios para realizar las pruebas del sistema.

Configuración del Backend
Ingresar a la carpeta:
cd incidex/backend
Instalar las dependencias:
npm install
Crear un archivo llamado:
.env
Tomando como referencia:
.env.example

Ejemplo de configuración:
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=dbgestionincidencias_postgresql

JWT_SECRET=incidex_secret_key

CORS_ORIGIN=http://localhost:4200
Es necesario colocar en DB_PASSWORD la contraseña correspondiente al usuario de PostgreSQL.

Ejecutar el Backend
Desde:incidex/backend
ejecutar:npm run dev
El backend estará disponible en:http://localhost:3000
También cuenta con una ruta para comprobar el funcionamiento de la API:/api/health
Por ejemplo:http://localhost:3000/api/health

Configuración del Frontend
Abrir otra terminal e ingresar a:cd incidex/frontend
Instalar las dependencias:npm install
Ejecutar Angular:npm start
La aplicación estará disponible normalmente en:http://localhost:4200

Autenticación y roles
El sistema utiliza autenticación mediante JSON Web Token (JWT).
Después de iniciar sesión, el sistema identifica el rol del usuario y controla el acceso a las diferentes funcionalidades.
Entre los roles contemplados se encuentran:
Administrador
Profesor
Personal TICS
Personal Servicios
Personal Infraestructura
El frontend utiliza guards e interceptores para ayudar a controlar las rutas y enviar la información de autenticación a la API.

Funcionalidades principales
Login
Permite a los usuarios ingresar al sistema utilizando sus credenciales.
Registro y administración de usuarios
El administrador puede gestionar los usuarios registrados y la información asociada a sus roles y departamentos.
Incidencias
Los usuarios autorizados pueden registrar y consultar incidencias indicando información como:
Título.
Descripción.
Categoría.
Ubicación.
Prioridad.
Estado.
Asignaciones
Permite asignar una incidencia a un usuario responsable de atenderla.

-Comentarios
Permite agregar observaciones relacionadas con una incidencia para mantener información sobre su atención.
-Adjuntos
Permite asociar archivos o evidencias a una incidencia.
-Historial
Registra los cambios realizados sobre una incidencia, permitiendo consultar su evolución.
-Notificaciones
Permite mostrar información relacionada con cambios importantes en las incidencias.
-Dashboard
Presenta información resumida para facilitar la consulta y seguimiento de las incidencias.

Pruebas
-Durante el desarrollo se realizaron pruebas de las principales funcionalidades del sistema.
-Entre los aspectos evaluados se encuentran:
-Inicio de sesión.
-Registro de usuarios.
-Validación de formularios.
-Registro de incidencias.
-Búsqueda de incidencias.
-Consulta de estados.
-Gestión de prioridades.
-Asignación de incidencias.
-Comentarios.
-Adjuntos.
-Eliminación y actualización de información.
-Dashboard.
También se registraron errores encontrados durante el desarrollo y las soluciones aplicadas en las matrices correspondientes al proyecto.

Consideraciones de seguridad
El proyecto incorpora diferentes mecanismos para controlar el acceso al sistema, entre ellos:
Autenticación mediante JWT.
Control de acceso según roles.
Protección de rutas.
Validación de información.
Manejo centralizado de errores.
Configuración mediante variables de entorno.
Separación entre frontend, backend y base de datos.
Nota: Este proyecto fue desarrollado con fines académicos. Algunas configuraciones de seguridad, infraestructura y despliegue pueden requerir mejoras antes de utilizarse en un entorno de producción real.

Documentación del proyecto
La carpeta ETAPAS contiene la documentación realizada durante el desarrollo del proyecto:
Etapa 1: Identificación de la problemática.
Etapa 2: Planificación del proyecto.
Etapa 3: Análisis de requerimientos.
Etapa 4: Historias de usuario.
Etapa 5: Diseño del sistema.
Etapa 6: Diseño de la base de datos.
Etapa 7: Diseño de interfaces.
Matrices: Cronograma, pruebas, errores y mejoras.
Esta documentación permite conocer el proceso seguido por el equipo desde la identificación del problema hasta el desarrollo del sistema.

Contexto académico
Incidex fue desarrollado como parte del proceso de aprendizaje de estudiantes de 5.º Perito en Informática.
El proyecto permitió aplicar conocimientos relacionados con:

-Desarrollo web.
-Programación con TypeScript.
-Angular.
-Desarrollo de APIs REST.
-Bases de datos relacionales.
-PostgreSQL.
-Autenticación.
-Control de versiones con Git y GitHub.
-Diseño de interfaces.
-Análisis de requerimientos.
-Historias de usuario.
-Pruebas de software.
-Trabajo colaborativo.
El desarrollo del sistema representa la aplicación práctica de los conocimientos adquiridos durante la formación académica, buscando resolver una problemática mediante una solución tecnológica funcional.

Estado del proyecto
Estado: Proyecto académico funcional.
El sistema cuenta con los módulos principales para la gestión de incidencias y continúa siendo susceptible a mejoras y ampliaciones.
Entre posibles mejoras futuras se pueden considerar:
Implementación de pruebas automatizadas.
Mejoras adicionales de seguridad.
Optimización del rendimiento.
Mejoras en los reportes y estadísticas.
Paginación y optimización de consultas.
Mejoras de accesibilidad.
Despliegue en un servidor.
Sistema de notificaciones más avanzado.

Equipo de desarrollo
Proyecto realizado por estudiantes de 5.º Perito en Informática.
El desarrollo se realizó de forma colaborativa, distribuyendo actividades relacionadas con:
-Base de datos.
-Backend.
-Frontend.
-Pruebas.
-Documentación.
-Integración del sistema.

Licencia:
Este proyecto se encuentra bajo la licencia especificada en el archivo LICENSE incluido en el repositorio.

Incidex
Sistema de Gestión de Incidencias
Proyecto académico desarrollado para aplicar conocimientos de análisis, diseño, desarrollo e implementación de sistemas informáticos.
