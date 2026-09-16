# FAVECA — Tienda en Línea

Sitio web de tienda en línea para FAVECA C.A. — Fábrica venezolana de camas y literas de acero.

## Características

- Catálogo de productos con filtros por categoría
- Carrito de compras completo
- Formulario de pedido con selección de punto de recogida
- Instrucciones de pago por transferencia bancaria
- Confirmación automática con enlace a WhatsApp para envío de comprobante
- Diseño 100% responsive (móvil, tablet, escritorio)
- Sin dependencias externas de pago (cero comisiones)

## Cómo subir a GitHub Pages (GRATIS)

### Paso 1: Crear repositorio en GitHub
1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en **"New repository"**
3. Nombre sugerido: `faveca-tienda`
4. Marca la opción **"Public"**
5. Haz clic en **"Create repository"**

### Paso 2: Subir los archivos
Puedes hacerlo de dos formas:

**Opción A — Arrastrar y soltar (más fácil):**
1. En tu nuevo repositorio, haz clic en **"uploading an existing file"**
2. Arrastra toda la carpeta `faveca/` a la ventana
3. Haz clic en **"Commit changes"**

**Opción B — Con Git (si tienes Git instalado):**
```bash
git init
git add .
git commit -m "Tienda FAVECA - versión inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/faveca-tienda.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages
1. En tu repositorio, ve a **Settings** → **Pages**
2. En "Branch", selecciona **"main"** y carpeta **"/ (root)"**
3. Haz clic en **"Save"**
4. En 2–3 minutos tu sitio estará en: `https://TU_USUARIO.github.io/faveca-tienda/`

## Personalización

### Agregar imágenes de productos
Las imágenes se referencian en `js/products.js`. Cada producto tiene un campo `image: null`. Para agregar imágenes:
1. Crea una carpeta `assets/img/` en el proyecto
2. Agrega las imágenes con nombres descriptivos (ej: `bedbox-con-patas.jpg`)
3. En `js/products.js`, cambia `image: null` por `image: "assets/img/bedbox-con-patas.jpg"`

### Actualizar datos bancarios
En `js/store.js`, busca la sección `bank-info-box` y actualiza los datos de la cuenta bancaria real.

### Agregar o modificar productos
Edita el archivo `js/products.js`. Cada producto sigue esta estructura:
```javascript
{
  id: 10,               // número único
  name: "Nombre",
  category: "cama",     // cama | litera | bedbox
  categoryLabel: "Cama",
  price: 200,           // precio en USD
  note: "Incluye IVA (16%)",
  description: "Descripción del producto...",
  specs: ["Especificación 1", "Especificación 2"],
  image: null           // o "assets/img/nombre.jpg"
}
```

### Cambiar número de WhatsApp
Busca `wa.me/584122900353` en `js/store.js` y reemplaza con tu número.

## Estructura del proyecto
```
faveca/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos
├── js/
│   ├── products.js     # Datos de productos
│   └── store.js        # Lógica de la tienda
├── assets/
│   └── img/            # Imágenes (agregar aquí)
└── README.md           # Este archivo
```

## Soporte
Para modificaciones o ayuda técnica: faveca.ad@gmail.com
