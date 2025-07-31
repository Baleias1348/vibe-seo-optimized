# Documentación de Editores y Componentes del Admin

## 1. TinyMCE Editor en el Admin

- **Ubicación principal:**
  - `/src/pages/admin/HomeBoxEditor.jsx` (Box 1)
  - `/src/pages/admin/HomeBoxEditor2.jsx` (Box 2)
- **Componente usado:** `<Editor />` de `@tinymce/tinymce-react`
- **Propósito:** Permite editar el contenido HTML enriquecido de los boxes principales de la homepage.
- **Persistencia:** El HTML generado se guarda en Supabase, tabla `homepage_boxes`, columna `content`.
- **Configuración clave:**
  - La opción `content_style` fue personalizada para controlar márgenes superiores de títulos y párrafos:
    ```js
    content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:16px; margin:0; } h1, h2, h3, h4, h5, h6, p { margin-top: 3px !important; margin-bottom: 8px; }`
    ```
  - Esto garantiza alineación visual precisa y elimina márgenes excesivos al mostrar el contenido en el frontend.

## 2. Otros Editores

- Se detectó también un componente `RichTextEditor` basado en ReactQuill (`quill.js`) en `/src/components/admin/forms/RichTextEditor.jsx`, usado en otros formularios del admin (como SkiCenterForm).
- **Recomendación:** Unificar el uso de editores en el futuro para evitar inconsistencias visuales y de experiencia.

## 3. Resumen de Componentes Clave

- **HomeBoxEditor.jsx / HomeBoxEditor2.jsx:** Editan el contenido de los boxes principales de la homepage usando TinyMCE.
- **RichTextEditor.jsx:** Usado para otros campos de texto enriquecido, basado en Quill.js.

---

> Última actualización: 2025-07-30. Cambios realizados para personalización de márgenes en el contenido de los boxes principales.
