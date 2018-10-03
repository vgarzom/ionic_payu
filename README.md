## ionic_payu
Proyecto de ejemplo de la utilización de la pasarela de pagos payu dentro de aplicaciones móviles creadas en ionic 2 en adelante.

## Introducción
Se accede a la plataforma de pagos a través de la pasarela [Web Checkout](http://developers.payulatam.com/es/web_checkout/) ofrecida por la misma. La principal ventaja de hacerlo de esta manera es que el desarrollador no debe ocuparse de toda la seguridad requerida en el almacenamiento de datos de tarjetas de crédito del usuario.

Para realizar la el acceso a través de la pasaralela nos basamos en la respuesta presentada por [Karthik RP](https://stackoverflow.com/users/5367148/karthik-rp) en stackoverflow, puede consultarse [aquí](https://stackoverflow.com/questions/47474135/how-to-integrate-payumoney-gate-way-in-ionic-3). Fue necesario hacer algunas modificaciones para asegurar que el funcionamiento con las variables actuales de Payu y de la librería InAppBrowser.

## Cómo funciona la solución
Puesto que Web Checkout no puede ser embebido en un iFrame, se hace necesario desplegarlo directamente en un navegador. En este sentido la librería de Cordova InAppBrowser es una opción viable. Esta consiste en embeber un navegador dentro de las aplicaciones realizadas en Phonegap, Ionic, etc. un InAppBrowser permite desplegar una página utilizando su url o un archivo html completo.

Para esta solución creamos un html con el formulario requerido por Web Checkout y lo presentamos al usuario a través de InAppBrowser, adicionalmente este html envía el formulario a Payu automáticamente utilizando javascript, finalmente lo que se despliega al usuario es la sección Payu encargada de toda la lógica del pago.

## Variables a tener en cuenta
Consultar ["Integración Web Checkout - Sandbox"](http://developers.payulatam.com/es/web_checkout/sandbox.html) para identificar las variables requeridas. Particularmente hacemos énfasies en
- API KEY
- MerchanId
- AccountID

Son obtenidas desde la consola de administración de Payu. Este ejemplo utiliza variables de prueba otorgadas por Payu.

- referenceCode: Es un código único para cada transferencia. En una aplicación en producción podría generarse como mejor lo defina el desarrollador, Ej: referenceCode = userId + productId + consecutive

## Como ejecutar
1. Por supuesto instalar ionic y su cli. [ionic get started](https://ionicframework.com/getting-started)
2. Agregar la plataforma con la que se va a trabajar. ```ionic cordova platform add ios/android```
3. Instalar InAppBrowser. ```ionic cordova plugin add cordova-plugin-inappbrowser```
4. Asegurarse que el archivo ```config.xml``` permite la navegación a todos los destinos. ```<allow-navigation href="*" />```
5. Ejecutar en un dispositivo o emulador. ->InAppBrowser no funciona en un navegador<-

## Licencia
Este repositorio se entrega bajo licencia MIT
