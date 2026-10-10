---
title: "Configurando Arch Linux"
description: "El conocimiento aumenta, la ciencia evoluciona, los procesos son más eficientes. Tu computadora debería ser más capaz, no menos."
date: 2026-10-10
tags: ["linux", "optimización", "historia"]
---

## Mi Motivación

En primer lugar, quería seguir explorando nuevas tecnologías y arquitecturas más complejas, pero los 4 GB de RAM —que eran suficientes para programar páginas web sin _frameworks_— se volvieron una limitación demasiado dolorosa como para soportarla. Así fue como empecé a explorar cómo armarme un servidor con una PC vieja que fuera lo más minimalista posible, por lo que probé **Arch Linux**.

En segunda instancia intervino mi ideología: saber que Linux es superior técnicamente y que puedes configurar exactamente tu computadora como quieres me enamoró. Fascinado por Rust al hacer las aplicaciones más rápidas y seguras, esta filosofía se volvió parte de mi identidad.

Como último detonante, mi situación financiera no era la mejor. Al intentar compilar una aplicación con Tauri, mi laptop no lo soportó y el ventilador (_heat fan_) se averió. Fue en ese momento cuando decidí pasarme a Arch Linux como mi distribución principal y única.

## La caja negra

Hubo dos motivos principales por los cuales nació Linux: el primero, tener más características; el segundo, tener libertad, tanto de propiedad como de decisión. La primera razón nos ha permitido tener servidores y teléfonos celulares; pero la segunda se ha estado olvidando. Considero que ofrecer un sistema que funcione _"out of the box"_ (listo para usar) es un gran paso para hacer más accesible la entrada a nuevas personas.

Arch Linux y, por ende, el **AUR** (_Arch User Repository_), cuentan hoy con una de las comunidades más grandes entre las distintas distribuciones. Esto dio inicio a la cultura de los _dotfiles_, facilitando la instalación y personalización del sistema, aunque obligándote a aprender el proceso interno de instalación del sistema operativo.

Por su parte, **CachyOS** demostró que los usuarios están verdaderamente entusiasmados por el rendimiento, pero eso solo se logra si se conocen y optimizan todas las piezas del sistema.

## La configuración implicita

### Mounts

Existe un salto abismal entre un SSD y un HDD. Esta elección es decisiva, ya que definirá la velocidad del sistema operativo, los programas y la seguridad de nuestros archivos.

**HDD (Disco Duro):** Es ideal para almacenamiento masivo de archivos a largo plazo debido a su costo y durabilidad en reposo, aunque es mucho más lento. Para estas unidades, **`ext4`** es la opción estándar y más rápida; es un sistema de archivos maduro, robusto y muy eficiente, ideal para servidores o almacenamiento continuo.

**SSD (Unidad de Estado Sólido):** Ofrece velocidades altísimas y accesos instantáneos, aunque las memorias flash pueden degradarse o perder datos si pasan largos periodos de tiempo sin energía eléctrica. Para aprovechar su rendimiento y proteger la integridad de los datos, la mejor alternativa es **`btrfs`**. Aunque puede tener un impacto mínimo en rendimiento frente a `ext4`, en una computadora personal esta pequeña desventaja se justifica por completo: obtienes un sistema hiperrobusto con snapshots que te permiten "regresar en el tiempo" ante cualquier fallo o actualización fallida.

### Network

A principios de los 2000, Windows y macOS superaban con creces a Linux en la **velocidad de asociación y tiempo de reconexión a redes Wi-Fi**. En Linux, el proceso era manual y lento debido a la fragmentación de scripts y al uso directo de demonios como `wpa_supplicant`. En 2004, Red Hat lanzó **NetworkManager** para automatizar el proceso y ofrecer una experiencia de usuario competitiva, aunque seguía dependiendo internamente de `wpa_supplicant` como motor de autenticación.

No fue sino hasta la llegada de **iwd** (_iNet wireless daemon_), desarrollado por Intel, que Linux dio un salto definitivo en velocidad de escaneo y autenticación: al ser una solución **mucho más ligera, optimizada y sin dependencias complejas**, interactúa directamente con el subsistema `nl80211` del kernel de Linux, logrando tiempos de conexión mínimos e incluso superando en agilidad a las pilas de red tradicionales.

Sin embargo, resolver la capa inalambrica con `iwd` solo solucionaba la mitad del problema: la latencia percibida al navegar seguía dependiendo del **DNS y la configuración de red**. Durante años, Linux dependió del archivo estático `/etc/resolv.conf`, el cual solía ser sobrescrito torpemente por los gestores de red. Para agilizar esto, se introdujeron capas intermedias como `systemd-resolved` o `dnsmasq`, pero esto añadía complejidad al flujo de datos.

En este escenario entra en juego **Knot Resolver (`kresd`)**. que opera como un **resolvedor DNS recursivo con caché persistente y soporte nativo de vanguardia para DNS-over-TLS (DoT) y DNSSEC**. Al eliminar las consultas redundantes y procesar la resolución de forma ultrarrápida, se reduce a milisegundos la latencia en el primer 'handshake' de red, eliminando el último cuello de botella que arrastraba la pila tradicional de Linux.

Sin embargo, la optimización de servicios no se detiene en la red. Durante décadas, el subsistema de audio en Linux estuvo fragmentado entre ALSA, PulseAudio y JACK, generando latencias altas y conflictos al trabajar con audio profesional o transmisión multimedia. La llegada de **PipeWire** marcó un hito en la arquitectura del sistema: un servidor unificado de audio y vídeo que procesa flujos de datos en tiempo real mediante un gráfico de nodos acelerado. Al sustituir las viejas capas intermedias por un motor ligero escrito en C, PipeWire redujo la latencia a niveles imperceptibles y eliminó el consumo innecesario de CPU, garantizando que el apartado multimedia responda con la misma agilidad que la pila de red.

### Compress

Ya no estamos limitados de forma estricta por la capacidad física de nuestro hardware: hoy es posible "ampliar" la memoria y el almacenamiento a cambio de un consumo mínimo de CPU.

En primer lugar la compresión de la **RAM**, es lo que permite tener en la mesa los programas listos para usarlos. Usando la tecnología `zram` llegamos a ocupar menos y podamos manejar más datos, pero hay un límite si se comprime por completo, no habrá espacio para descomprimir y el sistema colapsará, ante ello podemos destinarlo al disco, llamado `swap`, permite reservar memoria exclusiva como respaldo.

Sin embargo, cuando toda la memoria se agota, el gestor de _Out-Of-Memory_ (OOM) tradicional del kernel suele actuar demasiado tarde. Para evitarlo la comunidad recurre a **`earlyoom`** que monitorea las métricas de presión de memoria del kernel. Al detectar que el sistema empieza a ahogarse, interviene en milisegundos antes de que la interfaz se trabe.

De igual forma tenemos la compresión de los **archivos**, de hecho esta es la base de la imagen ISO, pero comprimir demasiado cuesta más computo para solo una ligera mejora. Es aquí donde brilla el algoritmo **`zstd`**, logrando el punto dulce perfecto: comprime rápido, ahorra espacio y consume el mínimo procesamiento.

### Kernel

Aquí viene nuestra pieza angular: el **kernel de Linux**, que contiene el código dormido para comunicarse con el hardware. Optimizado para maximizar el rendimiento general y la equidad del sistema, algo ideal para servidores, pero que puede no ofrecer la mejor respuesta en el uso personal o de escritorio.

Para solucionar esto, la comunidad creó **`linux-zen`**, una variante adaptada para reducir la latencia y dar prioridad a las tareas interactivas que utiliza el usuario. Durante mucho tiempo, esta fue la opción predilecta para escritorio y videojuegos.

Sin embargo, la distribución CachyOS demostró que aún había margen de mejora creando **`linux-cachyos`**. Este kernel optimiza la interactividad mediante el planificador de procesos **BORE** (_Burst-Oriented Response Enhancer_) y compila los binarios aprovechando al máximo las extensiones de cada arquitectura de CPU (como x86-64-v3 y v4), logrando un rendimiento superior.

### Repositories

Y justamente para aprovechar la arquitectura del procesador, se definen estos repositorios optimizados en la configuración de Pacman (`/etc/pacman.conf`), situándolos por encima de los repositorios base de la distribución. Esto permite ofrecer binarios compilados para instrucciones modernas (como x86-64-v3 o v4), manteniendo intacto el acceso al inmenso catálogo de AUR.

### Display Server

Toda esta optimización de hardware y servicios carecería de sentido si la capa visual siguiera arrastrando los cuellos de botella del pasado. Durante más de tres décadas, el servidor gráfico X11 actuó como un intermediario pesado entre las aplicaciones y la GPU, provocando _screen tearing_, desfases de renderizado y latencia en los eventos de entrada. La adopción definitiva de **Wayland** redefinió por completo la arquitectura visual: al eliminar el servidor intermediario, el propio compositor (como Hyprland o Sway) se comunica directamente con el subsistema gráfico del kernel de Linux (DRM/KMS). El resultado es una experiencia donde "cada fotograma es perfecto", liberando ciclos de CPU, optimizando el consumo en computadoras portátiles y permitiendo que la interfaz gráfica responda de manera instantánea a los gestos y movimientos del usuario.

## Ecosystem

Y finalmente la personalización y el control. Esta es la principal razón de la creación de distribuciones: darte un ecosistema listo para usar y visualmente coherente.

Alrededor de **1991** nace **Qt**, escrito en **C++**, ganando gran popularidad por ser multiplataforma y por la filosofía de sus creadores de permitir construir interfaces altamente atractivas y personalizables sin sacrificar el rendimiento.

En **1997** se crea **GTK**, escrito en **C**, concebido inicialmente para dar vida al editor de imágenes GIMP. Rápidamente se convirtió en el motor gráfico preferido para el proyecto **GNOME**, apostando por la simplicidad, la modularidad y una experiencia de usuario limpia y enfocada.

Para **2020** llega **GTK4** con una nueva arquitectura enfocada en el rendimiento mediante aceleración por GPU (Vulkan y OpenGL), redefiniendo las reglas del diseño en GNOME e introduciendo librerías como _Libadwaita_ para garantizar interfaces adaptativas y coherentes.

## UI

En 1996 se fundó el proyecto KDE, adoptando Qt como pilar técnico. Una de sus mayores ventajas radica en que, al mantener un entorno unificado en Qt, el consumo de memoria se optimiza al máximo, ya que el sistema y las aplicaciones comparten las mismas librerías cargadas en RAM.

Con la transición hacia Wayland, **Waybar** (basada en C++ y GTK) creada en **2018**, se consolidó como la barra de estado estándar para compositores y gestores de ventanas en mosaico (_tiling window managers_ como Sway y Hyprland).

Se crea en **2023** el proyecto **QuickShell**, dando una explosión en la comunidad de personalización (_ricing_) al permitir construir barras, widgets y componentes del sistema usando la potencia de Qt y QML de forma nativa en gestores de ventanas Wayland.

Como alternativa dentro del ecosistema GTK, surge en **2023** el proyecto **AGS** (_Aylur's GTK Shell_), revolucionando la personalización al permitir definir la interfaz del escritorio utilizando **TypeScript / JavaScript** y CSS sobre GTK, facilitando la creación de widgets y paneles altamente dinámicos y reactivos.

## Future

Una de las ventajas iniciales de QT fue su bajo consumo de ram, siempre y cuando tenías el escritorio completo, para los usuarios minimalistas el ecosistema de GTK era más atractivo y modulable, y gracias a la librería `gtk-rs` (GTK en Rust), ha ganado mucha atracción por su rendimiento, no obtante para mejorar aún más System76 opta por tener todo en Rust

**COSMIC DE**, un entorno de escritorio completo escrito desde cero en **Rust**. Su objetivo fue superar las limitaciones de arquitectura de GTK4 y lograr una experiencia Wayland ultra fluida, modular y segura. Para dar vida a este ecosistema, desarrollaron el framework **`libcosmic`** (basado en la librería GUI de Rust `iced`).

En la actualidad, la brecha del escritorio en Linux se ha dividido claramente entre dos filosofías: **la hiperpersonalización reactiva** mediante herramientas como QuickShell o AGS (asumiendo un mayor consumo de RAM al ejecutar entornos de ejecución como JS/QML), frente al **rendimiento extremo y la seguridad** que ofrece el desarrollo nativo en Rust.

Sin embargo, para muchos la interfaz del futuro se encuentra en la **tecnología web** (tema que profundizaré en la siguiente entrega). Por otro lado, el verdadero rendimiento consiste en saber conectar y ensamblar las mejores piezas; en este post he destacado las más importantes, dejando para la próxima publicación aquellas piezas poco vistas pero fundamentales del ecosistema.
