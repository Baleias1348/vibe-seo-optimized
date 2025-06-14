# Contexto del Proyecto Vibe SEO Optimized

## Estructura General
- **Tecnologías Principales**:
  - React con Vite
  - Tailwind CSS
  - Supabase
  - React Router

## Páginas Principales
1. **Inicio** (`/`)
   - Tarjeta de paseos que enlaza a la página de paseos
   - Sección de clima
   - Información general

2. **Paseos** (`/passeios`)
   - Cuadrícula de tarjetas de paseos
   - Integración con Stripe para pagos

3. **Clima** (`/clima`)
   - Selector de ciudades chilenas
   - Pronóstico del tiempo
   - Datos de OpenWeatherMap

4. **Moneda** (`/conversor-moeda`)
   - Conversor de monedas

## Configuraciones Especiales

### Política de Seguridad de Contenido (CSP)
Configurada en `index.html` para permitir:
- Stripe (js.stripe.com, api.stripe.com)
- OpenWeatherMap
- Recursos locales

### Variables de Entorno
- `VITE_OPENWEATHER_API_KEY`: Clave para la API de OpenWeatherMap
- Variables de configuración de Supabase

## Estado Actual
- **Rama Principal**: `main`
- **Última Actualización**: 13 de Junio 2025
- **Estado**: Funcionando correctamente

## Notas de Desarrollo
- La página de inicio fue actualizada recientemente para incluir una tarjeta de paseos
- Se corrigieron problemas de importación en MainLayout
- Se actualizó la CSP para soportar Stripe

## Integraciones
1. **Stripe**
   - Para pagos de paseos
   - Configuración CSP actualizada

2. **OpenWeatherMap**
   - Datos meteorológicos
   - Selector de ciudades chilenas

3. **Supabase**
   - Base de datos
   - Autenticación
   - Almacenamiento

## Estructura de Carpetas
```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas de la aplicación
│   ├── currency/   # Conversor de moneda
│   ├── tours/      # Página de paseos
│   └── weather/    # Página del clima
├── lib/           # Utilidades y configuraciones
└── styles/        # Estilos globales
```

## Comandos Útiles
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Desplegar
npm run deploy
```

## Contacto
- **Desarrollador**: [Tu nombre]
- **Última actualización**: 2025-06-13
