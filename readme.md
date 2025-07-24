**Test
En la carpeta public está el archivo html que se comparte a los teléfonos celulares.
En la carpeta MAIN está el sketch con la librería p5js que muestra la partitura.
El archivo bridge.js es el puente entre los teléfonos y la computadora.
Para esta prueba no hizo falta el protocolo OSC, con los webSockets fue más que suficiente.
** Funcionamiento:
*** Partitura general:
La partitura comienza con dos códigos QR, uno para ingresar en la red y el otro para acceder a la app de control.
Una vez que todos se han conectado y todo está listo, presionamos la tecla 's' (minúsculas) para comenzar la cinética.
Hay 5 partes.
*** Control del usuario:
La interfaz del usuario es muy simple. Hay un desplazador (slider) en dos dimensiones (2D) y dos botones. Mediante la exploración activa de estos tres elementos, se puede aportar al desarrollo de la obra.
1.
terminal:
node bridge.js
2. 
En el explorador poner:
http://localhost:3000/main/index.html
(3.)
Para pruebas, en otra ventana del explorador poner:
http://localhost:3000/
El usuario del teléfono tiene dos códigos QR, uno para unirse a la red de internet y el otro para descargar la aplicación de control que utilizará.