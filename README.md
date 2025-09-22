# MyMovies - Aplicación de Películas con React + TypeScript

Una aplicación web moderna para explorar y gestionar películas favoritas, construida con React, TypeScript, Vite y Server-Side Rendering (SSR).

## 🎬 Características

- **Exploración de películas** por géneros (Terror, Acción, Ciencia Ficción)
- **Lista de deseos** para guardar películas favoritas
- **Detalles de películas** con información completa
- **Diseño responsive** optimizado para móvil y escritorio
- **Server-Side Rendering (SSR)** para mejor SEO y rendimiento
- **Tests unitarios** completos con Vitest

## 🏗️ Estructura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── Carousel.tsx        # Carrusel de películas
│   ├── Header.tsx          # Navegación principal
│   ├── MovieCard.tsx       # Tarjeta de película
│   ├── FavoriteMovieCard.tsx # Tarjeta para página de favoritos
│   └── __test__/           # Tests de componentes
├── layouts/
│   └── MainLayout.tsx      # Layout principal de la aplicación
├── pages/                  # Páginas de la aplicación
│   ├── HomePage.tsx        # Página principal con géneros
│   ├── MovieDetailPage.tsx # Detalles de película específica
│   └── Favourites.tsx      # Lista de películas favoritas
├── services/               # Servicios externos
│   ├── tmdb.ts            # API client para TMDB
│   └── __test__/          # Tests de servicios
├── store/                  # Gestión de estado global
│   ├── wishlist.ts        # Store de Zustand para favoritos
│   └── __test__/          # Tests del store
├── styles/                 # Estilos SCSS organizados
│   ├── _global.scss       # Variables y estilos globales
│   ├── index.scss         # Archivo principal de estilos
│   ├── components/        # Estilos por componente
│   └── pages/            # Estilos por página
├── types/                 # Definiciones TypeScript
│   └── movie.ts          # Interfaces de películas
├── entry-server.tsx       # Entry point para SSR
└── main.tsx              # Entry point del cliente
```

## 🔧 Funcionalidades del Store (Zustand)

El store de `wishlist.ts` maneja el estado global de las películas favoritas:

### Métodos Disponibles

```typescript
interface WishlistState {
  wishlist: Movie[]; // Array de películas favoritas
  addToWishlist: (movie: Movie) => void; // Agregar película
  removeFromWishlist: (movieId: number) => void; // Eliminar película
  isInWishlist: (movieId: number) => boolean; // Verificar si está en favoritos
}
```

### Características del Store

- **Prevención de duplicados**: No permite agregar la misma película dos veces
- **Compatibilidad SSR**: Funciona tanto en servidor como cliente
- **Persistencia**: Mantiene el estado durante la sesión
- **TypeScript**: Completamente tipado

## 🌐 Servicios TMDB

El archivo `services/tmdb.ts` maneja toda la comunicación con The Movie Database API:

### Funciones Principales

```typescript
// Construir URLs de imágenes
getImageUrl(path: string | null, size?: string): string

// Obtener películas por género
getMoviesByGenre(genreId: number): Promise<Movie[]>

// Obtener detalles de una película específica
getMovieDetails(id: number): Promise<MovieDetails>
```

### Configuración

- **Base URL**: `https://api.themoviedb.org/3`
- **Autenticación**: Bearer Token (configurar en `.env`)
- **Idioma**: Español (es-ES)
- **Límite**: Máximo 10 películas por género

### Variables de Entorno

```env
VITE_TMDB_BEARER=tu_token_aqui
```

## 🏃‍♂️ Instalación y Desarrollo

### Prerrequisitos

- Node.js 20.19.0 o superior
- npm 10.9.1 o superior

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd myMovies

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu token de TMDB
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (CSR)

# Testing
npm run test            # Tests en modo watch
npm run test:run        # Ejecutar tests una vez
npm run test:coverage   # Tests con cobertura
npm run test:ui         # Interfaz gráfica de tests

# Linting
npm run lint            # Verificar código con ESLint

# Construcción
npm run build           # Build estándar
npm run build:client    # Build del cliente para SSR
npm run build:server    # Build del servidor para SSR
npm run build:ssr       # Build completo para SSR

# Producción
npm run start           # Servidor SSR (después del build)
npm run preview         # Preview del build estándar
```

## 🖥️ Renderizado del Cliente (CSR)

### Modo Desarrollo

```bash
npm run dev
```

- **Puerto**: http://localhost:5173
- **Hot Reload**: Cambios en tiempo real
- **Vite Dev Server**: Construcción rápida con ES modules

### Build de Producción (Cliente)

```bash
npm run build
npm run preview
```

- Genera archivos estáticos en `dist/`
- Optimización de assets y code splitting
- Minificación de CSS y JavaScript

## 🚀 Renderizado del Servidor (SSR)

### Configuración SSR

La aplicación incluye configuración completa para Server-Side Rendering:

#### Archivos Clave

- **`server.js`**: Servidor Express para SSR
- **`src/entry-server.tsx`**: Entry point del servidor
- **`src/main.tsx`**: Maneja hidratación automática

### Build y Ejecución SSR

```bash
# 1. Build completo para SSR
npm run build:ssr

# 2. Iniciar servidor SSR
npm run start
```

El servidor estará disponible en http://localhost:3000

### Proceso SSR

1. **Build del Cliente** (`dist/client/`):
   - Assets estáticos
   - JavaScript hidratación
   - CSS procesado

2. **Build del Servidor** (`dist/server/`):
   - Código React renderizable en Node.js
   - Entry point del servidor

3. **Servidor Express**:
   - Sirve assets estáticos desde `dist/client/`
   - Renderiza React en servidor
   - Inyecta HTML prerenderizado
   - Maneja rutas: `/` y `/movie/:id`

### Rutas SSR Soportadas

- `GET /` - Página principal
- `GET /movie/:id` - Detalles de película
- Archivos estáticos servidos automáticamente

### Hidratación

El cliente detecta automáticamente si hay contenido SSR:

```typescript
if (container.innerHTML) {
  // Hidrata contenido SSR existente
  ReactDOM.hydrateRoot(container, <App />);
} else {
  // Renderizado normal (desarrollo)
  ReactDOM.createRoot(container).render(<App />);
}
```

## 🧪 Testing

### Cobertura de Tests

- **Componentes**: MovieCard con mocks completos
- **Servicios**: TMDB API con mocks de fetch
- **Store**: Zustand con renderHook de Testing Library

### Ejecutar Tests

```bash
# Modo interactivo
npm run test

# Una sola vez
npm run test:run

# Con cobertura
npm run test:coverage

# Interfaz gráfica
npm run test:ui
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, React Router
- **Build Tool**: Vite 7
- **Estilos**: SCSS con arquitectura modular
- **Estado**: Zustand para gestión de estado
- **HTTP Client**: Axios para API calls
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **SSR**: Express.js + React Server Components

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación fluida a diferentes pantallas
- **Touch Friendly**: Interacciones táctiles optimizadas

## 🌟 Próximas Características

- [ ] Persistencia de favoritos en localStorage
- [ ] Búsqueda de películas
- [ ] Filtros avanzados
- [ ] Reseñas de usuarios
- [ ] PWA (Progressive Web App)

---

**Desarrollado con ❤️ usando React + TypeScript + Vite**

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
