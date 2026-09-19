# Incidex - Sistema de Gestión de Incidencias

Fundación Kinal — Sistema para registrar, clasificar, asignar y dar seguimiento
a incidencias de TICS, Servicios Generales e Infraestructura.

Motor de base de datos: **PostgreSQL**.

## Estructura

- `database/` - script de creación de base de datos (PostgreSQL)
- `backend/` - API REST (Express + TypeScript + PostgreSQL + JWT)
- `frontend/` - Angular (standalone, zoneless)

## 1. Base de datos

Crea una base de datos vacía en PostgreSQL y corre el script:

```
createdb dbgestionincidencias_in5cm
psql -U postgres -d dbgestionincidencias_in5cm -f database/dbgestionincidencias_postgresql.sql
```

El script crea las 11 tablas, sus relaciones (llaves foráneas), y los datos de
prueba (10 usuarios, 10 departamentos, 10 incidencias, etc.).

**Nota:** a diferencia de la versión en MySQL, aquí no hay stored procedures.
El backend hace las consultas SQL directamente (`SELECT`/`INSERT`/`UPDATE`/`DELETE`
parametrizadas), que es el enfoque más simple y estándar para trabajar con
PostgreSQL desde Node.

## 2. Backend

```
cd backend
cp .env.example .env   # ajusta tus credenciales de PostgreSQL
pnpm install
pnpm run dev
```
Queda escuchando en http://localhost:3000

## 3. Frontend

```
cd frontend
npm install
npm run start
```
Queda escuchando en http://localhost:4200 (no necesita ningún cambio: habla con
el backend por HTTP, sin importarle qué base de datos hay detrás)

## Cuentas de prueba

Todas usan la contraseña `pass1234`:

| Usuario        | Rol                        |
|----------------|----------------------------|
| admin_gral     | Administrador              |
| tics_juan      | Personal TICS              |
| prof_carlos    | Profesor                   |
| serv_pedro     | Personal Servicios         |
| infra_jorge    | Personal Infraestructura   |

## Actualización: notificaciones

Si ya tenías la base de datos creada de antes, corre este script una sola vez
(no borra ningún dato existente):

```
psql -U postgres -d dbgestionincidencias_in5cm -f database/agregar_notificaciones.sql
```

Si vas a crear la base desde cero, no hace falta este paso — ya está incluido
en `database/dbgestionincidencias_postgresql.sql`.

## Actualización: foto del login

Coloca tu foto real de Fundación Kinal en:

```
frontend/public/images/campus.jpg
```

Revisa `frontend/public/images/LEEME.txt` para más detalles.

## Actualización: categoría e ubicaciones

Se eliminó la categoría "Préstamo de Libros" y se reemplazó por completo el
catálogo de ubicaciones (ahora con Edificio de Básicos H1-H42, Edificio de
Diversificado C1-C38, laboratorios de computación separados, y áreas comunes
como cafetería, cancha sintética, patio, auditorios, etc.)

Si ya tenías la base de datos creada de antes, corre:

```
psql -U postgres -d dbgestionincidencias_in5cm -f database/actualizar_ubicaciones_categorias.sql
```

**Advertencia importante:** este script reemplaza TODAS las ubicaciones
existentes. Como las incidencias dependen de una ubicación, **cualquier
incidencia que tengas registrada se eliminará en cascada** (junto con sus
comentarios, historial, asignaciones y adjuntos), porque las ubicaciones
viejas a las que apuntaban ya no existirán. Si tienes incidencias reales que
quieras conservar, anota su información antes de correr este script.

Si vas a crear la base desde cero, no necesitas este paso — ya viene
incluido en `database/dbgestionincidencias_postgresql.sql`.
