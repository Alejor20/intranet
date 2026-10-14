# Plan de Arquitectura: Intranet Corporativa & Control de Equipos en Arrendamiento

Intranet empresarial integral orientada a la productividad operativa de la compañía, centralizando la gestión documental y de aplicaciones internas, el repositorio oficial de software instalador para computadores en alquiler, y un sistema ágil de trazabilidad de entradas y salidas de hardware mediante escaneo e impresión de códigos QR.

### Decisiones Críticas y Resumen de Alcance

> [!IMPORTANT]
> El sistema está diseñado para resolver tres necesidades operativas críticas en una sola experiencia fluida, sin fricción y con datos persistentes:
> 1. **Módulo de Gestión Documental y Aplicativos Internos:** Repositorio centralizado con clasificación por departamentos (RRHH, TI, Operaciones, Legal), control de versiones, vista previa y directorio de accesos directos a herramientas internas.
> 2. **Módulo de Software para PCs en Arriendo:** Catálogo curado de paquetes de software, instaladores descargables (.exe, .msi, scripts de aprovisionamiento silencioso), perfiles de instalación por tipo de puesto (Desarrollo, Diseño, Administrativo, Call Center) e instrucciones de despliegue.
> 3. **Control de Entradas y Salidas de Hardware con QR:** Registro de inventario (laptops, desktops, monitores, periféricos), clientes de arrendamiento, contratos activos, lector de códigos QR con cámara web/móvil en tiempo real (más soporte de lector USB/manual), generador e impresión de stickers con código QR para etiquetar los equipos físicos, y registro de auditoría de movimientos.

---

## 1. Visión General & Concepto Central

- **Propósito:** Optimizar el flujo de trabajo de la empresa y del departamento de TI, acelerando la entrega y recepción de equipos de cómputo en alquiler y asegurando que las herramientas y documentos clave estén siempre accesibles.
- **Público Objetivo:**
  - **Técnicos y Administradores de TI:** Responsables de preparar las máquinas, descargar e instalar el software base, despachar y recibir equipos con escáner QR e imprimir etiquetas.
  - **Colaboradores de la Empresa:** Empleados que consultan documentación corporativa, manuales, políticas y abren aplicativos de trabajo diario.
- **Valor Agregado Principal:** Reducción drástica del tiempo de registro en bodega/taller gracias al lector QR integrado en el navegador y trazabilidad total del ciclo de vida de cada computador arrendado.

---

## 2. Experiencia de Usuario & Diseño Visual

### Navegación y Vistas Principales
1. **Panel General (Dashboard Operativo):** Resumen de equipos arrendados vs disponibles, alertas de devoluciones próximas, documentos recientes y descargas frecuentes de software.
2. **Control de Equipos & Arrendamientos (QR Check-in / Check-out):**
   - Modal de escaneo QR en vivo con cámara (apuntando al sticker del equipo) con detección automática.
   - Opción alternativa de búsqueda por serial o lector de código de barras manual.
   - Acciones inmediatas con un clic: Registrar Salida (asignar a cliente, fecha límite, estado) o Registrar Entrada (devolución, inspección física, checklist de componentes).
   - Generador de etiquetas QR listas para imprimir o exportar para rotular los PCs.
3. **Catálogo de Software & Despliegue de PCs:**
   - Lista organizada por categorías (Ofimática, Seguridad/Antivirus, Drivers, Desarrollo, Navegadores, Utilidades de Diagnóstico).
   - Perfiles preconfigurados ("Pack Administrativo", "Pack Desarrollador", "Pack Call Center") con descarga masiva o script de instalación desatendida.
   - Fichas técnicas con versión, tamaño, checksum y requisitos mínimos.
4. **Gestor de Documentos y Aplicativos:**
   - Biblioteca de archivos con filtros por departamento, etiquetas, buscador en tiempo real y visor modal de documentos.
   - Lanzador de aplicativos corporativos con estados de servicio y accesos rápidos.
5. **Historial de Movimientos y Auditoría:**
   - Registro cronológico de todas las entradas y salidas con marca de tiempo, responsable, cliente y observaciones.

### Identidad Visual y Estilo (Anti-Slop & Directrices de Diseño)
- **Dirección Estética:** Estilo SaaS corporativo limpio, profesional y utilitario (Clean Enterprise), priorizando la legibilidad, la precisión en tablas y la eficiencia en pantalla completa (1440px).
- **Paleta de Colores (Regla 60-30-10):**
  - *Lienzo y Fondo (60%):* Blanco puro y grises suaves de alta definición (`bg-slate-50`, `bg-white`, `dark:bg-slate-950`).
  - *Estructura y Superficies (30%):* Bordes tenues `border-slate-200/80`, divisores limpios y tipografía de alto contraste `text-slate-900` / `text-slate-600`.
  - *Acentos (10%):* Azul corporativo cobalto (`#2563EB`) para acciones principales, esmeralda (`#16A34A`) para entradas/disponibilidad y ámbar (`#D97706`) para arriendos en curso.
- **Tipografía:**
  - Títulos y navegación: *Plus Jakarta Sans* / *Outfit* para una apariencia moderna y sobria.
  - Cifras, seriales, códigos QR y tablas: `font-mono tabular-nums` para alineación perfecta sin desplazamientos.
  - Cero badges genéricos ni píldoras estáticas decorativas; metadatos limpios separados por `·` o `/`.
- **Top Bar Contract:** Barra superior de un solo nivel con identidad corporativa ("Intranet Corporativa"), migas de pan contextuales, selector de rol (Administrador TI / Colaborador) y acción rápida (Escanear QR).

---

## 3. Decisiones Clave de Producto & Arquitectura Técnica

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│   [Logo Corporativo]   |   Módulos   |   [Modo Admin/User] [Escáner QR]│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Gestor Documental│     │ Catálogo Software│     │ Control Arriendo │
│ & Aplicativos    │     │ para PCs Alquiler│     │ & Escaneo QR     │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│· Filtro Deptos   │     │· Paquetes x Perfil│    │· Escáner Cámara  │
│· Visor / Subida  │     │· Descargas direct│     │· Generador Stickers│
│· Hub Aplicativos │     │· Scripts Deploy  │     │· Entrada / Salida│
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌──────────────────────────────────┐     ┌──────────────────────────────────┐
│   Historial de Entradas/Salidas  │     │     Almacenamiento Persistente   │
│   y Auditoría de Movimientos     │     │     (LocalStorage & Mock State)  │
└──────────────────────────────────┘     └──────────────────────────────────┘
```

### Gestión de Escaneo e Impresión de Códigos QR
- **Escáner Interactivo:** Integración con biblioteca nativa web de escaneo QR (soporte de cámara frontal y trasera en dispositivos móviles/laptops con selector de dispositivo, más input de contingencia para pistolas de código de barras USB que envían un "Enter" al leer).
- **Generador de Etiquetas Imprimibles:** Cada equipo registrado tiene su vista previa de etiqueta de activo fijo con QR, código de serie, modelo y especificaciones, con botón de impresión optimizado para hojas de stickers o impresora térmica/convencional mediante `@media print`.

### Catálogo de Software
- Cada software cuenta con metadatos reales (versión, desarrollador, peso, compatibilidad Windows/Linux, comandos de instalación silenciosa tipo `winget install` o flags `.msi /qn`).
- Botón de descarga directa con simulación de descarga o guardado local de scripts `.bat` / `.ps1` para aprovisionamiento automatizado del PC en arrendamiento.

### Persistencia y Resiliencia
- Almacenamiento local reactivo persistente en el navegador (`localStorage`) precargado con datos corporativos realistas de ejemplo (12+ equipos de distintas gamas, 8+ clientes de alquiler, 15+ aplicativos/instaladores, documentos de políticas y formatos de entrega).
- Capacidad de exportar/importar datos en formato JSON para respaldar o restaurar la base de inventario y movimientos.

---

## 4. Fases de Implementación

1. **Fase 1: Estructura Base, Tipografía y Estado Global**
   - Configuración de tokens de color, tipografía *Plus Jakarta Sans*, modelos TypeScript (Equipos, Clientes, Movimientos, Software, Documentos, Aplicativos).
   - Hook de persistencia de datos e historial de movimientos.
2. **Fase 2: Módulo de Control de Arrendamiento y Escáner QR**
   - Implementación del lector QR por cámara interactiva con selector de stream de video y zona de captura visual.
   - Flujo de Entrada (Check-in) y Salida (Check-out) con formulario asistido y cálculo de días en arrendamiento.
   - Vista de detalle de equipo y modal de generación/impresión de stickers QR.
3. **Fase 3: Módulo de Gestión y Descarga de Software para PCs**
   - Repositorio con buscador por categoría, filtros por tags y tarjetas con botones de descarga.
   - Generador de scripts de instalación automatizada (PowerShell/Batch) según los paquetes seleccionados.
4. **Fase 4: Módulo de Gestión Documental y Directorio de Aplicativos**
   - Biblioteca de documentos con descarga, visualizador modal y formulario de carga de nuevos documentos.
   - Hub de aplicativos internos con enlaces directos, estado de servicio y accesos rápidos.
5. **Fase 5: Dashboard Principal, Reportes y Verificación Final**
   - Métricas clave en tiempo real (disponibilidad, arriendos activos, próximos retornos).
   - Pruebas de compilación, verificación de diseño sin clisés y validación responsiva.
