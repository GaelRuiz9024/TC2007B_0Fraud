# 🛡️ 0 Fraud — Manual de Usuario y Guía de Implementación

## 📘 Descripción General

**0 Fraud** es una plataforma diseñada para **reportar, analizar y gestionar incidentes de ciberfraude** de manera colaborativa.
El proyecto está desarrollado en **NestJS (Node.js + TypeScript)** y emplea una **base de datos MySQL**, con autenticación mediante **JWT (JSON Web Tokens)**.

Su objetivo es ofrecer una API segura y escalable para el manejo de:

* Reportes de fraudes digitales (phishing, estafas, malware, etc.).
* Administración de usuarios y roles.
* Clasificación de reportes en categorías.
* Generación de estadísticas y métricas sobre los incidentes registrados.

---

## ⚙️ Instalación y Configuración

### 🔧 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

* **Node.js** v20 o superior
* **npm** o **yarn**
* **MySQL Server**

### 📁 Instalación del Proyecto

Ejecuta el siguiente comando para instalar las dependencias:

```
npm install
```

### ⚙️ Archivo de Configuración `.env`

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# --- Base de Datos MySQL ---
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=miContrasenaSegura
DB_NAME=ciberseguridaddb

# --- JWT ---
JWT_SECRET=supersecretParaProduccion

# --- Servidor ---
PORT=4000
```

---

## 🧩 Estructura Principal del Proyecto

| Módulo              | Descripción                                                 |
| :------------------ | :---------------------------------------------------------- |
| **AuthModule**      | Manejo de autenticación y emisión de tokens JWT.            |
| **UserModule**      | Registro, login y gestión de perfiles de usuarios.          |
| **AdminModule**     | CRUD de usuarios, roles y administración general.           |
| **ReportModule**    | Creación, búsqueda, actualización y estado de reportes.     |
| **CategoryModule**  | Manejo de categorías de fraudes.                            |
| **AnalyticsModule** | Cálculo y visualización de métricas del sistema.            |
| **FilesModule**     | Subida y gestión de archivos/imágenes asociadas a reportes. |

---

## 💾 Base de Datos

El sistema utiliza una base de datos **MySQL** con las tablas principales:

| Tabla            | Campos Clave                                         | Descripción                                              |
| :--------------- | :--------------------------------------------------- | :------------------------------------------------------- |
| `usuario`        | `id`, `correo`, `contrasenaHash`, `idRol`, `activo`  | Información de usuarios y su rol (1: Admin, 2: Usuario). |
| `categoria`      | `id`, `nombre`, `activa`                             | Categorías de fraude reportadas.                         |
| `reporte`        | `id`, `idUsuario`, `titulo`, `descripcion`, `estado` | Información de los reportes creados.                     |
| `imagen_reporte` | `idReporte`, `urlImagen`                             | Enlaces de las imágenes asociadas a los reportes.        |

---

## ▶️ Ejecución del Proyecto

```
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

Una vez iniciado, la API estará disponible en:

```
http://localhost:4000
```

Y la documentación interactiva de Swagger en:

```
http://localhost:4000/docs
```

---

## 👤 Flujo de Usuario Estándar

| Paso                | Endpoint                    | Método | Descripción                                           |
| :------------------ | :-------------------------- | :----- | :---------------------------------------------------- |
| 1️⃣ Registro        | `/users`                    | POST   | Crea una cuenta nueva.                                |
| 2️⃣ Login           | `/auth/login`               | POST   | Devuelve `accessToken` y `refreshToken`.              |
| 3️⃣ Crear Reporte   | `/reports`                  | POST   | Envía un nuevo reporte (estado inicial: “Pendiente”). |
| 4️⃣ Subir Imagen    | `/reports/:reportId/images` | POST   | Asocia una imagen al reporte.                         |
| 5️⃣ Mis Reportes    | `/reports/my-reports`       | GET    | Lista los reportes del usuario autenticado.           |
| 6️⃣ Buscar Reportes | `/reports/search?q=`        | GET    | Busca reportes aprobados.                             |

---

## 🧑‍💼 Flujo de Administrador

| Paso                   | Endpoint                           | Método | Descripción                                            |
| :--------------------- | :--------------------------------- | :----- | :----------------------------------------------------- |
| 1️⃣ Login Admin        | `/auth/login`                      | POST   | Acceso con rol administrador.                          |
| 2️⃣ Ver Reportes       | `/reports/admin/all-reports`       | GET    | Obtiene todos los reportes.                            |
| 3️⃣ Actualizar Estado  | `/reports/admin/update-status?id=` | PUT    | Cambia estado a “Aprobado”, “Rechazado” o “Pendiente”. |
| 4️⃣ Crear Categoría    | `/admin/categories`                | POST   | Crea nuevas categorías de fraude.                      |
| 5️⃣ Listar Usuarios    | `/admin/user/list`                 | GET    | Obtiene usuarios activos.                              |
| 6️⃣ Cambiar Rol        | `/admin/user/:id/role`             | PUT    | Cambia rol de usuario.                                 |
| 7️⃣ Desactivar Usuario | `/admin/user/:id`                  | DELETE | Marca el usuario como inactivo.                        |
| 8️⃣ Ver Analíticas     | `/analytics/status-percentage`     | GET    | Muestra estadísticas por estado.                       |

---

## 🧠 Casos de Uso Destacados

**Caso: Reporte de Phishing Aprobado**

| Paso | Acción               | Resultado Esperado                    |
| :--- | :------------------- | :------------------------------------ |
| 1    | Registro de usuario  | Usuario almacenado correctamente.     |
| 2    | Login exitoso        | JWT generado.                         |
| 3    | Envío de reporte     | Estado inicial: “Pendiente”.          |
| 4    | Aprobación por admin | Estado cambia a “Aprobado”.           |
| 5    | Búsqueda pública     | Reporte visible solo si fue aprobado. |

---

## 🧪 Comandos de Prueba

```
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## ☁️ Despliegue

Sigue la guía oficial de NestJS para despliegue en producción:
🔗 [https://docs.nestjs.com/deployment](https://docs.nestjs.com/deployment)

Para una implementación rápida en AWS:

```
npm install -g @nestjs/mau
mau deploy
```

---

## 📚 Recursos Útiles

* Documentación oficial: [https://docs.nestjs.com](https://docs.nestjs.com)
* Comunidad Discord: [https://discord.gg/G7Qnnhy](https://discord.gg/G7Qnnhy)
* Cursos oficiales: [https://courses.nestjs.com](https://courses.nestjs.com)
* Visualizador DevTools: [https://devtools.nestjs.com](https://devtools.nestjs.com)

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.
Creado como parte del proyecto académico **0 Fraud** para promover la **ciberseguridad ciudadana**.

---

**Autores:**

* Gael Alejandro Ruiz Bahena
* Eleanor Alarcón Neri
* Emma Sofia Aparicio Rodriguez 
* Equipo de desarrollo 0 Fraud

**Versión:** 1.0.0
**Última actualización:** Octubre 2025
