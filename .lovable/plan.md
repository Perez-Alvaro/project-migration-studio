# Haruén en Lovable Cloud: tienda con gestión, secciones modulares y talleres virtuales

## Objetivo
Pasar la tienda y el contenido del sitio de "escritos en el código" a una base de datos en Lovable Cloud, con un panel de administración pensado para el equipo, con la comodidad de Shopify pero sin una cuenta de Shopify. Los pedidos se siguen cerrando por WhatsApp.

## Lo que verá el público

**Tienda renovada (estilo Shopify)**
- Catálogo con filtros por categoría, búsqueda y orden (precio, novedad).
- Ficha de cada producto en su propia página: galería de fotos, descripción, precio, stock disponible ("Últimas 2 unidades", "Sin stock") y productos relacionados.
- Variantes opcionales (por ejemplo, color o tamaño), cada una con su propio stock.
- Carrito lateral como el de hoy. Al confirmar, se guarda el pedido y se abre WhatsApp con el resumen y el número de pedido.

**Novedades**
- Nueva página de novedades (noticias, logros, eventos), cada una con su propia página para compartir.
- Bloque "Últimas novedades" disponible para la portada.

**Talleres virtuales**
- Página pública con el listado de talleres: portada, descripción, modalidad, fechas y docente.
- Para ver las clases y descargar el material (PDF o Word) hay que crear una cuenta y que el equipo apruebe la inscripción.
- El alumno ve "Mis talleres" con sus clases y descargas.

**Portada modular**
- La portada se arma con bloques: inicio, campaña de donación, nosotros, impacto, información, tienda, novedades, talleres, donaciones y contacto.
- El orden y la visibilidad de cada bloque se manejan desde el panel.

## Panel de administración (solo cuentas del equipo, todas con permisos de administrador)
- **Productos:** crear, editar, archivar y borrar; subir varias fotos; precio; categoría; destacados; variantes; stock.
- **Stock:** vista rápida de todos los productos con stock bajo, ajustes de cantidad e historial de movimientos.
- **Pedidos:** listado de pedidos llegados por WhatsApp, con estados (nuevo, confirmado, entregado, cancelado). Al confirmar un pedido se descuenta el stock y al cancelarlo se devuelve.
- **Categorías.**
- **Novedades:** redactar, poner una foto de portada, publicar o dejar como borrador.
- **Talleres virtuales:** crear el taller y sus clases, subir materiales en PDF o Word y aprobar o dar de baja a los inscriptos.
- **Secciones de la portada:** mostrar u ocultar bloques, reordenarlos arrastrando y editar los textos principales de cada uno.
- **Ajustes:** número de WhatsApp, datos bancarios para donaciones y estado de la campaña (iniciada, en progreso o finalizada), sin tocar código.
- **Equipo:** invitar a otra persona como administradora.

## Migración de lo existente
- Los 18 productos actuales, con sus fotos y precios, se cargan en la base de datos.
- Los textos y datos de la campaña y la portada pasan a ser editables, con los valores que tienen hoy.
- Nada se pierde: el sitio se ve igual hasta que el equipo decida cambiarlo.

## Pasos de construcción
1. Activar Lovable Cloud y crear las cuentas (correo y contraseña) y el rol de administrador.
2. Crear la base de datos y cargar los productos actuales.
3. Tienda pública: catálogo, ficha de producto y pedido por WhatsApp con registro en la base.
4. Panel: productos, stock, pedidos y categorías.
5. Portada modular y editor de secciones.
6. Novedades: página pública y gestión desde el panel.
7. Talleres virtuales: inscripción, aprobación, clases y descarga de materiales.
8. Revisión completa en el navegador (comprador, alumno y administrador), accesibilidad y velocidad.

## Qué voy a necesitar de ustedes
- El correo de la primera persona administradora (se habilita después de que se registre).
- Opcional: textos o fotos de las primeras novedades y del primer taller. Si no los hay, dejo ejemplos claramente marcados para reemplazar.

## Detalles técnicos
- Tablas: `products`, `product_images`, `product_variants`, `categories`, `stock_movements`, `orders`, `order_items`, `news_posts`, `page_sections` (type, position numeric, is_visible, content jsonb), `site_settings`, `workshops`, `workshop_lessons`, `workshop_materials`, `workshop_enrollments` (status pending/approved/revoked), `profiles`, `user_roles` + `has_role()` security definer. RLS y GRANT explícitos en todas las tablas.
- Lectura pública solo de productos, novedades y talleres publicados, secciones visibles y ajustes públicos. Todas las escrituras quedan restringidas a `has_role(auth.uid(),'admin')`.
- Pedidos: se crean con una función de servidor que valida precios y stock en el servidor (no confía en el carrito del navegador) y devuelve el número de pedido para el mensaje de WhatsApp. El stock se descuenta por función SQL al confirmar el pedido, para que sea atómico.
- Almacenamiento: bucket público `product-images` y `news-images`; bucket privado `workshop-materials` (PDF/DOC/DOCX, máx. 20 MB). La descarga se hace con URL firmada de corta duración, emitida por una función de servidor que verifica que la inscripción esté aprobada.
- Rutas: `/tienda`, `/tienda/$slug`, `/novedades`, `/novedades/$slug`, `/talleres`, `/talleres/$slug`, `/auth`, `/reset-password`, `_authenticated/mis-talleres`, `_authenticated/admin/*`. Cada ruta pública con su propio `head()`.
- Portada: un registro de componentes por tipo de sección, renderizado según `page_sections` ordenado por `position`. Los bloques actuales se conservan como componentes.
- Lectura con loaders y `ensureQueryData` sobre funciones de servidor. Las escrituras del panel usan `requireSupabaseAuth` y la comprobación de rol.
- El reordenamiento usa `position` numeric con interpolación (drag & drop accesible por teclado).
- Se mantienen la paleta y las tipografías de la guía de marca Haruén.
