# MICAPA - Ministerio el Camino de la Palabra
### Plataforma Digital y Sitio Web Oficial con Radio en Vivo

Plataforma digital integral para la iglesia cristiana **MICAPA (Ministerio el Camino de la Palabra)** y su emisora **Radio Mi Capa** en Comayagua, Honduras.

---

## 🚀 Características Principales

1. **Diseño Visual e Identidad Institucional**:
   - Integración del logotipo oficial de MICAPA con la corona dorada y el camino blanco ascendente.
   - Paleta cromática oficial: Azul Cielo (`#0288D1`), Verde Esperanza (`#2E7D32`), Dorado Corona (`#F59E0B`), fondos limpios crema/blanco (`#FFFDF9`) y tipografía **Poppins**.
   - Interfaz **full responsive** optimizada para móviles, tablets y computadoras de escritorio.

2. **Radio Mi Capa en Vivo**:
   - Streaming Icecast en directo a 192 kbps: `https://hoststream.micapa.net/listen/radiomicapa/radio.mp3`.
   - Consulta y actualización en tiempo real de título, artista y carátula mediante la API de **AzuraCast**: `https://hoststream.micapa.net/api/nowplaying/radiomicapa`.
   - **Reproducción continua y persistente**: El audio no se interrumpe al navegar entre secciones del portal gracias al `AudioPlayerContext` y la barra inferior flotante (Persistent Dock).
   - Enlace directo a la app y chat global en `https://radio.micapa.net`.

3. **Portal Público Completo (Multi-página)**:
   - **Inicio (`/`)**: Hero atmosférico, reproductor de radio destacado, pensamiento pastoral, agenda semanal de cultos, eventos próximos, sermones en video, canales oficiales y formulario de oración.
   - **Nosotros (`/nosotros`)**: Misión, visión, valores y fundamentación bíblica del ministerio.
   - **Pensamientos del Pastor (`/mensajes`)**: Directorio de reflexiones bíblicas y vista de lectura individual (`/mensajes/[id]`) con botones para compartir por WhatsApp y Facebook.
   - **Actividades Semanales (`/actividades`)**: Agenda semanal detallada con cultos de oración (martes), discipulado (jueves), jóvenes (viernes), damas y caballeros (sábado), y cultos de celebración (domingo).
   - **Eventos (`/eventos`)**: Calendario y afiches de conferencias y congresos, con páginas de detalle (`/eventos/[id]`).
   - **Predicaciones (`/predicaciones`)**: Catálogo audiovisual clasificado por series y expositores.
   - **Radio en Vivo (`/radio`)**: Página dedicada a la emisora con reproductor ampliado y enlace al chat.
   - **Contacto (`/contacto`)**: Formulario interactivo, mapa referencial, dirección física en Comayagua y botón directo a WhatsApp.

4. **Panel Administrativo Protegido (`/admin`)**:
   - Autenticación segura mediante cookies HTTP-only y contraseñas cifradas con `bcryptjs`.
   - **Dashboard**: Estadísticas en tiempo real de contenidos y accesos rápidos.
   - **Módulo de Pensamientos**: Publicar, editar, eliminar, asignar fotos y categorías.
   - **Módulo de Actividades**: Gestionar horarios y cultos de lunes a domingo.
   - **Módulo de Eventos**: Publicación de conferencias, fechas, afiches y lugares.
   - **Módulo de Predicaciones**: Registro de enlaces a videos y series.
   - **Configuración Institucional**: Edición de teléfonos, correos, dirección física de Comayagua, streaming de radio y activación de transmisiones en directo.

5. **Persistencia Local de Alto Rendimiento**:
   - Base de datos **SQLite** con `better-sqlite3` en modo WAL (sin costos de servicio en la nube, ultra rápido y 100% portable a Supabase o PostgreSQL cuando se requiera).
   - Subida y almacenamiento local de imágenes en `/public/uploads/`.

---

## 🛠️ Tecnologías

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) con React 19 y TypeScript.
- **Estilos**: [Tailwind CSS 3.4](https://tailwindcss.com/) con tema corporativo MICAPA.
- **Iconografía**: [Lucide React](https://lucide.dev/) + iconos SVG optimizados.
- **Base de Datos**: [SQLite](https://www.sqlite.org/) vía `better-sqlite3`.
- **Autenticación**: JSON Web Tokens (JWT) & `bcryptjs`.

---

## 📦 Puesta en Marcha

### 1. Requisitos
- Node.js versión 18 o superior.
- npm.

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Inicializar base de datos y datos de prueba
```bash
npm run seed
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3001`.

### 5. Compilar para producción
```bash
npm run build
npm start
```

---

## 🔐 Acceso Administrativo Inicial

- **URL del Panel**: `http://localhost:3001/admin`
- **Correo**: `admin@micapa.org`
- **Contraseña**: `admin123456`

*(La contraseña y los datos pueden modificarse directamente en el panel administrativo).*

---

## 📍 Datos Institucionales Verificados

- **Iglesia**: MICAPA (Ministerio el Camino de la Palabra)
- **Sede**: Bo. El INVA Calle 2 NO, entre 5a Avenida SE y 7a Avenida SE, Comayagua, Honduras
- **Teléfono**: +504 2772-0872
- **Correo**: micapacomayagua@gmail.com
- **Web Oficial**: micapa.net
- **Web de la Radio**: radio.micapa.net
