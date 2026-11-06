# Kanban del proyecto

Este archivo documenta la división de tareas del equipo y respalda el tablero [Inmobiliaria Riri — EFI de Trello](https://trello.com/b/tW7tghIb/inmobiliaria-riri-efi). Ambos utilizan las columnas **Pendiente**, **En desarrollo**, **En revisión** y **Finalizado**.

## Pendiente

| Tarjeta | Responsable | Criterio de finalización |
|---|---|---|
| Crear formulario de solicitud de visita | Santiago Delfino | El botón abre el formulario y valida los datos |
| Conectar solicitud de visita con la API | Santiago Delfino | El endpoint responde `201` y registra la visita |
| Revisar catálogo, filtros e imágenes en producción | Alejandro Quiroga | El recorrido público funciona en escritorio y móvil |
| Verificar API, CORS y datos de visitas en producción | Facundo Bellandi | Frontend y backend se comunican sin errores |
| Revisar documentación y despliegue del backend | SantiiCapee | README, Docker y documentación de la API están actualizados |

## En desarrollo

| Tarjeta | Responsable | Estado |
|---|---|---|
| README completo del frontend | Santiago Delfino | Redacción y revisión técnica |
| Tablero Kanban y división de tareas | Santiago Delfino | Organización de tarjetas y responsables |

## En revisión

| Tarjeta | Responsable | Verificación |
|---|---|---|
| Interfaz pública y responsive | Alejandro Quiroga | Catálogo, filtros, detalle, Navbar y Footer |
| Componentes y panel administrativo | Facundo Bellandi | Tarjetas, precio, eliminación y navegación administrativa |
| Autenticación y CRUD | Santiago Delfino | Login, rutas protegidas y formularios |
| Suite de tests del frontend | Facundo Bellandi | Vitest informa `4 passed` |
| Integración frontend y backend | Facundo Bellandi | Variables de entorno, CORS y endpoints |

## Finalizado

| Tarjeta | Responsable | Resultado |
|---|---|---|
| Conexión del frontend con la API de Django | Santiago Delfino | Consumo mediante `NEXT_PUBLIC_API_URL` y `fetch` |
| Login y logout con JWT | Santiago Delfino | Sesión funcional con access token |
| AuthContext y protección de rutas | Santiago Delfino | Panel privado con redirección al Login |
| Panel y CRUD de propiedades | Santiago Delfino | Listado, alta, edición y eliminación |
| Formularios con React Hook Form y Zod | Santiago Delfino | Login, creación y edición validados |
| Configuración inicial de Vitest | Santiago Delfino | Dos pruebas automatizadas aprobadas |
| Corrección del modo oscuro | Santiago Delfino | Navbar e Inicio adaptados |
| Correcciones del detalle | Santiago Delfino | Imagen, precio, tipo, barrio y características |
| Proyecto base con Next.js y Tailwind | Alejandro Quiroga | Estructura inicial del frontend |
| ThemeContext y tema claro/oscuro | Alejandro Quiroga | Preferencia visual global |
| Navbar, Footer y página Nosotros | Alejandro Quiroga | Layout público y navegación responsive |
| Catálogo público y filtros | Alejandro Quiroga | Exploración y búsqueda de propiedades |
| Detalle e imágenes de propiedades | Alejandro Quiroga | Ficha pública y recursos visuales |
| Propiedades destacadas | Alejandro Quiroga | Ruta y presentación de destacados |
| Integración de Pull Requests | Alejandro Quiroga | Cambios incorporados a `main` |
| Layout del panel administrativo | Alejandro Quiroga | Estructura compartida para rutas privadas |
| Modelos y API REST | Facundo Bellandi | Backend de propiedades y operaciones |
| Autenticación y endpoints de gestión | Facundo Bellandi | Permisos y operaciones privadas |
| Componente de precio y tarjetas | Facundo Bellandi | Componentes reutilizables del frontend |
| Server Component de propiedades | Facundo Bellandi | Carga de propiedades disponibles |
| Eliminación en dos pasos | Facundo Bellandi | Confirmación antes del borrado |
| Navbar administrativo | Facundo Bellandi | Navegación propia del panel |
| Tests y endpoints de visitas del backend | Facundo Bellandi | Flujo de visitas cubierto en la API |
| Ampliación a cuatro tests del frontend | Facundo Bellandi | Filtros y componente de precio verificados |
| OpenAPI, Swagger y Redoc | SantiiCapee | Documentación navegable de la API |
| CORS y variables de entorno | SantiiCapee | Integración configurable con el frontend |
| Dockerfile y Docker Compose | SantiiCapee | Ejecución reproducible del backend |
| README y capturas del backend | SantiiCapee | Documentación técnica completa |

## Flujo de cada tarjeta

1. La tarjeta comienza en **Pendiente** con un responsable definido.
2. Al crear la rama correspondiente pasa a **En desarrollo**.
3. Al abrir el Pull Request pasa a **En revisión**.
4. Después de la aprobación, merge y verificación pasa a **Finalizado**.

## Convención de ramas

- `feature/...` para funcionalidades.
- `fix/...` para correcciones.
- `test/...` para pruebas.
- `docs/...` para documentación.
