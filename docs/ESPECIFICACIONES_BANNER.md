# Especificaciones del Banner Culinario

## Imagen Original
- **Ruta**: `/public/images/banner-culinaria chilena.png`
- **Dimensiones**: 1280 × 200 píxeles
- **Relación de aspecto**: 32:5 (6.4:1)

## Implementación Responsiva

### Contenedor Principal
```jsx
<div className="relative w-full max-w-6xl mx-auto" style={{ paddingTop: '15.625%' }}>
    <img 
        src="/images/banner-culinaria chilena.png" 
        alt="Gastronomía Chilena - Descubre los sabores de Chile"
        className="absolute top-0 left-0 w-full h-full object-contain rounded-lg shadow-md"
    />
</div>
```

### Explicación de las Clases y Estilos
- `relative`: Establece el contexto de posicionamiento para la imagen absoluta.
- `w-full`: Ocupa todo el ancho disponible.
- `max-w-6xl`: Ancho máximo de 72rem (1152px).
- `mx-auto`: Centrado horizontal.
- `paddingTop: '15.625%'`: Mantiene la proporción de aspecto (200/1280 = 0.15625 o 15.625%).
- `object-contain`: Asegura que la imagen mantenga su relación de aspecto.
- `rounded-lg shadow-md`: Bordes redondeados y sombra suave.

## Ubicación en la Página
El banner se encuentra en la página de inicio (`HomePage.jsx`), justo después del componente `HomeQuickAccessBar` y antes de la sección de clima.

## Consideraciones de Accesibilidad
- Texto alternativo descriptivo para lectores de pantalla.
- Mantenimiento de la relación de aspecto en todos los tamaños de pantalla.
- Carga optimizada al mantener el tamaño de archivo original.
