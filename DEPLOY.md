# Deploy con Google Cloud Run

Esta landing page es un sitio estatico hecho con HTML, CSS y JavaScript. Para desplegarlo en Cloud Run se usa Docker con Nginx, porque Cloud Run necesita ejecutar un contenedor que escuche peticiones HTTP.

## Archivos del proyecto

- `index.html`: contiene la estructura principal de la pagina: navegacion, secciones, textos, botones y formulario.
- `styles.css`: contiene los estilos visuales: colores, tamanos, animaciones, responsive design y apariencia general.
- `script.js`: contiene la interaccion de la pagina: menu movil, animaciones al hacer scroll, contador de estadisticas y formulario.
- `Dockerfile`: define como se construye la imagen Docker para Cloud Run.
- `nginx.conf`: configura Nginx para servir la pagina en el puerto `8080`.
- `.dockerignore`: evita subir archivos innecesarios al construir la imagen.

## Por que se usa el puerto 8080

Cloud Run espera que el contenedor escuche en el puerto indicado por la variable `PORT`. En muchos despliegues el valor por defecto es `8080`. Por eso `nginx.conf` tiene:

```nginx
listen 8080;
```

Esto significa que Nginx recibe las visitas en el puerto `8080` dentro del contenedor.

## Explicacion del Dockerfile

```dockerfile
FROM nginx:1.27-alpine
```

Usa una imagen base de Nginx ligera. Nginx es el servidor que entrega los archivos de la landing page al navegador.

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Copia la configuracion personalizada de Nginx. Aqui se define que el servidor escuche en el puerto `8080`.

```dockerfile
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY script.js /usr/share/nginx/html/script.js
```

Copia los archivos de la pagina a la carpeta publica de Nginx. Esa carpeta es desde donde Nginx sirve el sitio web.

```dockerfile
EXPOSE 8080
```

Documenta que el contenedor usa el puerto `8080`. No abre el puerto por si solo, pero ayuda a indicar como debe ejecutarse.

## Probar localmente con Docker

Desde esta carpeta:

```bash
docker build -t landing-cloud-run .
docker run --rm -p 8080:8080 landing-cloud-run
```

Luego abre:

```text
http://localhost:8080
```

## Deploy en Google Cloud Run

Primero inicia sesion:

```bash
gcloud auth login
```

Selecciona tu proyecto de Google Cloud:

```bash
gcloud config set project TU_ID_DEL_PROYECTO
```

Activa las APIs necesarias:

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

Construye y sube la imagen con Cloud Build:

```bash
gcloud builds submit --tag gcr.io/TU_ID_DEL_PROYECTO/landing-cloud-run
```

Despliega en Cloud Run:

```bash
gcloud run deploy landing-cloud-run --image gcr.io/TU_ID_DEL_PROYECTO/landing-cloud-run --platform managed --region us-central1 --allow-unauthenticated --port 8080
```

Cuando termine, Google Cloud mostrara una URL publica. Ese es el enlace de tu landing page desplegada.

## Que hace cada comando

- `gcloud auth login`: inicia sesion con tu cuenta de Google.
- `gcloud config set project`: selecciona el proyecto donde se hara el deploy.
- `gcloud services enable`: activa los servicios necesarios para construir y desplegar.
- `gcloud builds submit`: envia el codigo a Google Cloud, construye la imagen Docker y la guarda.
- `gcloud run deploy`: crea o actualiza el servicio de Cloud Run.
- `--allow-unauthenticated`: permite que cualquier persona pueda abrir la landing page.
- `--port 8080`: le indica a Cloud Run que el contenedor escucha en el puerto `8080`.
