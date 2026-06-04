FROM nginx:1.27-alpine

# copia la configuracion para que escuche el puerto 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf    

# copia -- Esa carpeta es desde donde Nginx sirve el sitio web
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY script.js /usr/share/nginx/html/script.js

# No abre el puerto por si solo, ayuda a indicar como debe ejecutarse
EXPOSE 8080
