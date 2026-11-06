# 🏠 Inmobiliaria Riri — Frontend Web

Frontend de la Evaluación Final Integradora de **Programación III e Ingeniería de Software** (ITEC - Desarrollo de Software, 2026).

**Inmobiliaria Riri** es una inmobiliaria de Río Cuarto dedicada a la venta y alquiler de casas, departamentos, locales y terrenos. Esta aplicación web, desarrollada con **Next.js y React**, permite explorar el catálogo público y administrar las propiedades desde un panel privado. Los datos se obtienen desde la API REST realizada con Django REST Framework.

Para el buscador y la ficha de cada propiedad tomamos como referencia el funcionamiento de una inmobiliaria real de la ciudad: operación, tipo, barrio, ambientes, dormitorios, precio o la leyenda **Consultar precio**, imágenes, características y contacto con la inmobiliaria.

## 🌐 Enlaces del proyecto

- **Aplicación publicada:** [inmobiliaria-phi-five.vercel.app](https://inmobiliaria-phi-five.vercel.app)
- **Repositorio del backend:** [FacBel/inmobiliaria-riri-back](https://github.com/FacBel/inmobiliaria-riri-back)
- **Tablero Kanban en Trello:** [Inmobiliaria Riri — EFI](https://trello.com/b/tW7tghIb/inmobiliaria-riri-efi)
- **Respaldo del Kanban en el repositorio:** [docs/KANBAN.md](docs/KANBAN.md)

## 🛠️ Tecnologías

- Next.js 16 con App Router.
- React 19.
- TypeScript.
- Tailwind CSS 4.
- React Hook Form para el manejo de formularios.
- Zod para los esquemas y las validaciones.
- Context API para la autenticación y el tema.
- JWT para el acceso al panel administrativo.
- Vitest y Testing Library para las pruebas.
- ESLint para el análisis estático.
- Vercel para el despliegue.

## 🧩 Planificación del frontend

El proyecto se dividió en dos áreas principales: el sitio público para visitantes y el panel administrativo para el personal de la inmobiliaria.

| Área | Funcionalidades |
|---|---|
| Sitio público | Inicio, catálogo, filtros, propiedades destacadas, detalle, página Nosotros y tema claro/oscuro |
| Autenticación | Login con JWT, cierre de sesión, persistencia del access token y protección de rutas |
| Administración | Panel privado, listado, alta, edición y eliminación de propiedades |
| Formularios | React Hook Form, validaciones con Zod y mensajes de error |
| Integración | Consumo de la API de Django mediante `fetch` y variables de entorno |
| Calidad | TypeScript, ESLint, build de producción y tests con Vitest |

### Algunas decisiones

- El `AuthProvider` se monta en el layout raíz para compartir la sesión en toda la aplicación.
- El access token se guarda en `sessionStorage`: permanece durante la pestaña actual y se elimina al cerrar la sesión.
- Las rutas administrativas redirigen a `/login` cuando el usuario no está autenticado.
- La seguridad definitiva se mantiene en el backend, que rechaza las operaciones privadas sin un JWT válido.
- Los formularios de Login, creación y edición utilizan React Hook Form y Zod para mantener juntas las reglas y los tipos.
- Si una propiedad no tiene precio o su valor es cero, se muestra **Consultar precio**.
- Si una foto falta o no puede cargarse, se utiliza una imagen predeterminada.
- Los identificadores de barrio, tipo y características se resuelven contra sus endpoints para mostrar nombres legibles.
- La eliminación se realiza con una confirmación en dos pasos para evitar borrados accidentales.
- Las tarjetas y el precio se separaron en componentes reutilizables.

## 📁 Estructura del proyecto

```text
inmobiliaria-riri-front/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx               # Layout y navegación administrativa
│   │   │   ├── page.tsx                 # Panel principal
│   │   │   └── propiedades/             # Listado, alta y edición
│   │   ├── login/page.tsx               # Inicio de sesión
│   │   ├── nosotros/page.tsx            # Página institucional
│   │   ├── propiedades/
│   │   │   ├── page.tsx                 # Catálogo y filtros
│   │   │   ├── destacadas/page.tsx      # Propiedades destacadas
│   │   │   └── [id]/page.tsx            # Detalle dinámico
│   │   ├── error.tsx                    # Estado de error
│   │   ├── loading.tsx                  # Estado de carga
│   │   ├── not-found.tsx                # Página 404
│   │   ├── layout.tsx                   # Layout raíz y providers
│   │   └── page.tsx                     # Inicio
│   ├── components/
│   │   ├── BorrarPropiedad.tsx          # Confirmación de eliminación
│   │   ├── Footer.tsx
│   │   ├── LayoutContenido.tsx
│   │   ├── Navbar.tsx
│   │   ├── PrecioPropiedad.tsx
│   │   ├── PropiedadCard.tsx
│   │   ├── PropiedadesDisponibles.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   ├── imagenesPropiedades.ts
│   │   ├── propiedades.ts
│   │   └── propiedades.test.ts
│   └── test/setup.ts
├── docs/
│   └── KANBAN.md                        # División y estado de las tareas
├── .env.example
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## 🚀 Instalación y uso

### Requisitos

- Node.js 20 o superior.
- npm.
- La API de Django ejecutándose localmente o publicada.

Clonar el repositorio:

```bash
git clone https://github.com/AleQuiroga26/inmobiliaria.git
cd inmobiliaria
```

Instalar las dependencias:

```bash
npm install
```

Crear `.env.local` a partir del ejemplo:

```bash
cp .env.example .env.local
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configurar la dirección de la API:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

El backend debe permitir `http://localhost:3000` dentro de `CORS_ORIGINS`.

Levantar el servidor de desarrollo:

```bash
npm run dev
```

El frontend queda disponible en [http://localhost:3000](http://localhost:3000).

## 📜 Comandos

| Comando | Para qué se utiliza |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación y validación de producción |
| `npm run start` | Ejecución de la compilación de producción |
| `npm run lint` | Análisis del código con ESLint |
| `npm run test` | Vitest en modo interactivo |
| `npm run test:run` | Ejecución única de todos los tests |

## 🗺️ Rutas

### Públicas

| Ruta | Contenido |
|---|---|
| `/` | Inicio, buscador y propiedades disponibles |
| `/propiedades` | Catálogo con búsqueda y filtros |
| `/propiedades/destacadas` | Selección de propiedades destacadas |
| `/propiedades/{id}` | Ficha completa de una propiedad |
| `/nosotros` | Información institucional |
| `/login` | Formulario de inicio de sesión |

### Administrativas

| Ruta | Contenido |
|---|---|
| `/admin` | Resumen del panel |
| `/admin/propiedades` | Listado y acciones administrativas |
| `/admin/propiedades/nueva` | Formulario de creación |
| `/admin/propiedades/{id}/editar` | Formulario de edición |

Las rutas administrativas comprueban la sesión antes de mostrar el contenido. Si el token falta o la API responde `401`, se limpia la sesión y se redirige al Login.

## 🔌 Consumo de la API

La URL base se lee desde `NEXT_PUBLIC_API_URL`. Los recursos principales son:

| Endpoint | Método | Uso en el frontend |
|---|---|---|
| `/token/` | POST | Obtener el access token |
| `/propiedades/` | GET | Catálogo y panel administrativo |
| `/propiedades/` | POST | Crear una propiedad con JWT |
| `/propiedades/{id}/` | GET | Mostrar o editar una propiedad |
| `/propiedades/{id}/` | PATCH | Guardar una edición con JWT |
| `/propiedades/{id}/` | DELETE | Eliminar con JWT |
| `/propiedades/disponibles/` | GET | Mostrar propiedades disponibles |
| `/barrios/` | GET | Nombres y opciones de barrios |
| `/tipos-propiedad/` | GET | Nombres y opciones de tipos |
| `/caracteristicas/` | GET | Características adicionales |
| `/agentes/` | GET | Opciones de agentes |
| `/propietarios/` | GET | Opciones privadas de propietarios |

Los listados de Django REST Framework vienen paginados. El frontend obtiene las propiedades desde `results` y contempla estados de carga, error y listas vacías.

## 🔐 Autenticación

El Login envía usuario y contraseña a:

```text
POST /api/token/
```

El backend devuelve `access` y `refresh`. Actualmente el frontend guarda el `access` en `sessionStorage` y lo envía en las operaciones privadas:

```text
Authorization: Bearer <access_token>
```

`AuthContext` expone:

- `token`
- `isAuthenticated`
- `isLoading`
- `login()`
- `logout()`

El Navbar cambia sus opciones según el estado de la sesión y permite ingresar al panel o cerrar sesión.

## 🎨 Tema claro y oscuro

`ThemeContext` agrega o elimina la clase `dark` en el documento. Los componentes utilizan variantes de Tailwind como `dark:bg-slate-950` y `dark:text-white`, por lo que no necesitan duplicar su lógica con condicionales de JavaScript.

La adaptación incluye Inicio, Navbar, menú móvil, catálogo, detalle, formularios y panel administrativo.

## 🧪 Tests

Vitest utiliza `jsdom`, Testing Library y un archivo de configuración común en `src/test/setup.ts`.

Actualmente existen cuatro casos automatizados en dos archivos:

1. Busca propiedades por título.
2. Filtra propiedades por barrio.
3. Muestra **Consultar precio** cuando el valor no está disponible.
4. Formatea correctamente un precio expresado en dólares.

Para ejecutarlos:

```bash
npm run test:run
```

Resultado actual:

```text
Test Files  2 passed
Tests       4 passed
```

## 🌿 Organización con Git

Trabajamos con una rama por tarea, creada desde `main` actualizado. Cada cambio se integra mediante un Pull Request revisado por otro integrante.

| Etapa | Rama o grupo | Contenido |
|---|---|---|
| 0 | `main` | Proyecto base con Next.js, TypeScript y Tailwind |
| 1 | `feature/layout-tema` | Providers, tema, Navbar, Footer y páginas públicas |
| 2 | `feature/admin-auth` | JWT, AuthContext, panel y CRUD |
| 3 | Catálogo y filtros | Listado público, búsqueda, filtros y detalle |
| 4 | `fix/modo-oscuro-navbar-inicio` | Corrección visual del tema oscuro |
| 5 | `fix/detalle-propiedad` | Imagen, precio, barrio y tipo en la ficha |
| 6 | `feature/componentes` | Tarjetas, precio, Server Component y eliminación |
| 7 | `fix/caracteristicas-detalle` | Nombres de características adicionales |
| 8 | Catálogo y admin | Tarjetas públicas, Navbar y layout administrativo |
| 9 | `feature/tests` | Ampliación de la suite a cuatro tests |
| 10 | `docs/readme-kanban` | README y división de tareas |

El flujo de una tarea es:

1. Actualizar `main`.
2. Crear una rama `feature/...`, `fix/...`, `test/...` o `docs/...`.
3. Implementar y verificar el cambio.
4. Hacer commit y push.
5. Abrir un Pull Request hacia `main`.
6. Solicitar revisión y fusionar.

## 📋 Kanban

La planificación se organiza con las columnas:

- **Pendiente**
- **En desarrollo**
- **En revisión**
- **Finalizado**

La planificación activa se encuentra en el tablero [Inmobiliaria Riri — EFI de Trello](https://trello.com/b/tW7tghIb/inmobiliaria-riri-efi). La división actual, los criterios de finalización y las tareas también se conservan en [docs/KANBAN.md](docs/KANBAN.md) para que queden versionados junto al código.

## 👥 Integrantes

### Santiago Delfino — Dsan04

- Conexión del frontend con la API.
- Login y logout con JWT.
- AuthContext y rutas protegidas.
- Panel administrativo y CRUD.
- Formularios con React Hook Form y Zod.
- Configuración inicial de Vitest.
- Correcciones de modo oscuro y ficha de propiedades.

### Alejandro Quiroga — AleQuiroga26

- Proyecto base y estilos con Tailwind.
- ThemeContext, Navbar, Footer y páginas públicas.
- Catálogo, filtros, imágenes y diseño del detalle.
- Propiedades destacadas, layout administrativo e integración de Pull Requests.

### Facundo Bellandi — FacBel

- API REST de Django y endpoints de gestión.
- Componentes reutilizables de precio y tarjetas.
- Server Component de propiedades disponibles.
- Eliminación en dos pasos y navegación administrativa.
- Tests del componente de precio y ampliación de la suite a cuatro casos.

### SantiiCapee

- Documentación OpenAPI del backend.
- CORS y variables de entorno.
- Docker, Docker Compose y capturas de la API.

## 📌 Estado del proyecto

El frontend se encuentra en la etapa final de integración y ya está publicado en Vercel. El catálogo, la autenticación y el CRUD están operativos.

Tareas pendientes para completar la entrega:

- Crear el formulario público de solicitud de visita.
- Conectarlo con `POST /api/propiedades/{id}/solicitar_visita/`.
- Mantener sincronizados el tablero de Trello y el Kanban versionado.
