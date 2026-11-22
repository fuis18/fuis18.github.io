---
title: Web Ecosystem
description: Abre en blog de notas, escribe en html, ábrelo en el navegador, tu página web, un shot de dopámina donde comenzó la pasión de muchos
date: 2026-11-21
tags: ["blink", "gecko", "webkit"]
---

¿Es la creación de páginas Web la solución de las apps multiplataforma con un diseño bonito? resulta que aún hay webs que te dicen: "solo Chrome o Brave"

## Guerra de los Navegadores

A principios de los años noventa, la web eran documentos de texto enlazados entre sí. Todo cambió en 1993 con **NCSA Mosaic**, el primer navegador en popularizar las imágenes integradas dentro de las páginas: por primera vez, navegar fue también mirar. Entre sus creadores estaba Marc Andreessen, quien poco después partiría para cofundar Netscape, llevándose consigo la convicción de que el navegador era la puerta de entrada a la red.

A finales de 1994 nació **Netscape Navigator**, un navegador que ofrecía una experiencia visual más rápida que la de sus competidores, justo cuando convergían tres factores decisivos: la popularización de las computadoras personales baratas, el acceso comercial a Internet para hogares y empresas, y la posibilidad de descargarlo en distintos sistemas operativos. Gracias a esa combinación, en menos de dos años alcanzó **más del 80 % de cuota de mercado**, dejando atrás a los competidores emergentes.

En 1995 Microsoft puso en marcha su estrategia: Windows 95 llegaba de fábrica con **Internet Explorer** preinstalado, gracias a contratos de exclusividad con los fabricantes de equipos originales (OEM) que impedían distribuir navegadores de la competencia. Además, Microsoft regalaba su navegador, quitándole a Netscape su principal fuente de ingresos: contra un competidor que no necesitaba vender nada, la batalla por las funciones se volvía imposible de ganar.

Con el temor de que Microsoft terminara dominando la web, Netscape respondió en diciembre de 1995 lanzando **JavaScript**, un lenguaje pensado para dar vida a las páginas web y para que cualquier sitio funcionara igual en cualquier navegador. Era la puerta de entrada a un ideal ambicioso: que el navegador pudiera ejecutar aplicaciones en cualquier sistema operativo, sin pedir permiso a Windows. Ese impulso por llenar la web de vida quedaría, paradógicamente, en manos de una pequeña herramienta de animación.

En mayo de 1996 FutureWave Software desarrolló **FutureSplash Animator**, una herramienta ligera de animación vectorial para la web. Generaba archivos tan pequeños que podían descargarse en segundos, ideal para una era de líneas telefónicas de 28.8 kbps, y ponía la animación al alcance de cualquier creador sin servidores caros ni programación avanzada. Ese mismo año, en diciembre, **Macromedia** compró FutureWave y lo renombró como **Macromedia Flash 1.0**.

### El florecimiento del contenido y el dominio total

A partir de 1998 se empezó a popularizar **Newgrounds**, la plataforma creada por Tom Fulp para publicar animaciones y juegos hechos con **Flash**. Al eliminar la necesidad de servidores caros o programación avanzada, la herramienta abarató el contenido interactivo y dio origen a una vibrante cultura de creadores amateur y humor viral que definió la web durante los siguientes quince años.

Al llegar el lanzamiento de **Windows 98**, este integró profundamente a Internet Explorer en el núcleo del sistema operativo, un movimiento que provocó la reacción inmediata de los reguladores: ese mismo año, el Departamento de Justicia de Estados Unidos y varios estados interpusieron una histórica demanda antimonopolio, acusando a Microsoft de abusar de su posición dominante al vincular ambos productos. El impacto sobre Netscape fue fulminante: incapaz de frenar su caída, la empresa fue absorbida por AOL a finales de 1998.

En septiembre de 1998, dos estudiantes de doctorado de Stanford, **Larry Page y Sergey Brin**, fundaron **Google**. Su apuesta era ajena a la guerra en curso: no regalar navegadores ni atar productos a sistemas operativos, sino ordenar el caos de la web con su algoritmo PageRank y sostenerse con la publicidad de las búsquedas, un negocio que solo podía prosperar si la web seguía siendo abierta y neutral.

De esa web abierta nacería, también, una pieza clave que nadie valoraría en su momento. En octubre de 2000 **KHTML** se lanzó públicamente junto con **KDE 2.0**. Lo desarrolló el proyecto KDE (liderado inicialmente por Lars Knoll y Waldo Bastian) como sucesor del motor `khtmlw`, para dar a Linux un navegador ligero y compatible con los estándares modernos: HTML 4, CSS y JavaScript mediante su motor hermano **KJS**.

El dominio de Internet Explorer, mientras tanto, tocó techo: en 2002 llegó a acaparar alrededor del **96 %** del mercado. Sin embargo, Netscape, antes de caer, había liberado su código fuente en 1998 bajo el **proyecto Mozilla**, sobreviviendo hasta entonces con apoyos marginales.

### El renacer de la competencia

Al mismo tiempo nació **Epiphany**, como una bifurcación del anterior navegador Galeon, tras una discusión entre los desarrolladores por mantenerlo simple.

El 9 de noviembre de 2004 se lanzó **Firefox**, dos años después de aquel código liberado: un navegador independiente, centrado únicamente en la navegación y mucho más ligero. Se desarrolló bajo el resguardo de la Mozilla Foundation (creada en 2003 con Mitchell Baker al frente) y de la Mozilla Corporation (fundada en 2005 para su desarrollo y comercialización mediante acuerdos con motores de búsqueda).

En febrero de 2005 nació **YouTube**, que triunfó frente a otros sitios de video anteriores porque usó **Macromedia Flash Player** para reproducir videos directamente dentro del navegador, resolviendo la fragmentación de formatos y codecs sin instalar nada.

También en aquel momento, Apple adoptó el motor KHTML para construir Safari, rebautizándolo como **WebKit** y puliéndolo hasta convertirlo en la base de los navegadores de Mac y, más tarde, del iPhone.

En diciembre de 2005, Adobe completó la compra de Macromedia, integrando a Flash en su suite creativa y uniendo bajo un mismo techo al gigante de las herramientas de diseño con el rey del contenido interactivo web.

### Chrome y la estandarización de los motores

El golpe llegó en 2008, cuando Google presentó **Chrome**, construido sobre WebKit y con un nuevo motor, JavaScript V8. Chrome llegó con ideas nuevas que obligaron a toda la industria a mejorar: procesos separados para cada pestaña, un entorno aislado o sandbox para la seguridad y una barra omnibox que combinaba búsquedas y direcciones. Google también liberó el proyecto como software abierto a través de Chromium, y sus actualizaciones automáticas silenciosas ayudaron a que las novedades llegaran rápido a los usuarios.

Epiphany, el navegador de GNOME, arrastraba desde hacía años los problemas de depender de Gecko: los ciclos de versiones de ambos proyectos no se alineaban y Firefox se veía cada vez más como un componente interno de Mozilla que como una base para terceros. Para resolverlo, en julio de 2007 su equipo añadió WebKit como motor alternativo y el 1 de abril de 2008 anunció que abandonaría Gecko por completo; la migración se culminó con la versión incluida en GNOME 2.28, publicada en septiembre de 2009. El mensaje de fondo era claro: la web se estandarizaba, y los motores también.

### El declive de Flash y la privacidad como bandera

En 2010 Apple **bloqueó Flash** en el iPhone y el iPad citando problemas de rendimiento, batería y seguridad. Steve Jobs publicó aquel año una carta abierta titulada «Thoughts on Flash», en la que explicaba que una tecnología concebida en la era del PC no encajaba con la era móvil de pantallas táctiles y autonomía limitada, y defendió los estándares abiertos (HTML5, CSS3, WebGL) como el camino a seguir.

Alrededor de 2011 quedó claro que los sitios podían identificar a cada visitante sin cookies mediante el _fingerprinting_: rasgos como las fuentes instaladas, la resolución de pantalla o los complementos formaban una huella casi única, y a diferencia de una cookie, no se podía borrar. Como respuesta, el Tor Project construyó **Tor Browser** como una bifurcación endurecida de Firefox. Su objetivo era radical: que todos los usuarios parecieran idénticos entre sí y que la privacidad naciera del propio navegador.

### La era de Chromium

En 2013, Google bifurcó WebKit y creó **Blink**, su propia rama del motor de renderizado. La separación se debió, en gran parte, a que la arquitectura multiproceso de Chrome y sus necesidades de rendimiento diferían cada vez más del rumbo que Apple quería dar a WebKit. Ese mismo año, Opera abandonó su motor propio, para adoptar Blink, dejando el panorama dividido en dos grandes familias: la derivada de KHTML (WebKit y Blink) y la de Gecko, mantenida por Mozilla.

Windows 10, lanzado en 2015, debutado con **Microsoft Edge**, sucesor de Internet Explorer, equipado con su propio motor de renderizado, **EdgeHTML**, y el motor JavaScript Chakra. Pero una web construida a imagen de Chrome convertía cada incompatibilidad en una pérdida de usuarios, y en diciembre de 2018 Microsoft anunció que reconstruiría Edge sobre Chromium.

En 2016 nació **Brave** como fase de beta, fundado por **Brendan Eich**, coautor de JavaScript y breve CEO de Mozilla, junto a Brian Bondy, también ex de Mozilla. Alcanzó la versión 1.0 el 13 de noviembre de 2019, ya con el bloqueo por defecto de anuncios y rastreadores y ventanas privadas con Tor.

**Microsoft Edge**, heredero de aquel Internet Explorer victorioso, consumó el giro en 2020. Con ello, tres de los navegadores dominantes actuales (Chrome, Edge y Opera) pasaron a compartir la misma familia de motores, quedando Mozilla Firefox como el único bastión independiente.
