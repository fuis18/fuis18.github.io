---
title: "Arch Linux konfigurieren"
description: "Das Wissen wächst, die Wissenschaft entwickelt sich weiter, die Prozesse werden effizienter. Dein Computer sollte leistungsfähiger sein, nicht weniger leistungsfähig."
date: 2026-10-10
tags: ["linux", "Optimierung", "Geschichte"]
---

## Meine Motivation

Zunächst wollte ich neue Technologien und komplexere Architekturen erkunden, doch die 4 GB RAM – die für die Webentwicklung ohne Frameworks ausgereicht hatten – erwiesen sich als eine zu schmerzhafte Einschränkung. So begann ich zu erforschen, wie ich aus einem alten PC einen möglichst minimalistischen Server bauen könnte, und probierte dabei **Arch Linux** aus.

Ein weiterer Faktor war meine Überzeugung: Die Erkenntnis, dass Linux technisch überlegen ist und man seinen Computer exakt nach eigenen Wünschen konfigurieren kann, begeisterte mich. Da mich Rust faszinierte – weil es Anwendungen schneller und sicherer macht –, wurde diese Philosophie zu einem Teil meiner Identität.

Schließlich spielte auch meine finanzielle Situation eine Rolle. Als ich versuchte, eine Anwendung mit Tauri zu kompilieren, war mein Laptop überfordert und der Lüfter ging kaputt. In diesem Moment beschloss ich, zu Arch Linux als meiner einzigen Hauptdistribution zu wechseln.

## Die Blackbox

Es gab zwei Hauptgründe für die Entstehung von Linux: erstens mehr Funktionen und zweitens Freiheit – sowohl in Bezug auf das Eigentum als auch auf die Entscheidungsfreiheit. Der erste Grund hat uns Server und Mobiltelefone beschert, doch der zweite geriet zunehmend in Vergessenheit. Ich bin der Meinung, dass ein System, das „out of the box“ (sofort einsatzbereit) funktioniert, einen wichtigen Schritt darstellt, um neuen Nutzern den Einstieg zu erleichtern.

Arch Linux und damit auch das **AUR** (_Arch User Repository_) verfügen heute über eine der größten Communities unter den verschiedenen Distributionen. Dies begründete die Kultur der „Dotfiles“, die die Installation und Anpassung des Systems erleichtert, auch wenn sie einen dazu zwingt, die internen Abläufe bei der Installation des Betriebssystems zu verstehen.

**CachyOS** wiederum hat gezeigt, dass Nutzer großen Wert auf Leistung legen – doch diese lässt sich nur erzielen, wenn man alle Komponenten des Systems kennt und optimiert.

## Die implizite Konfiguration

### Mounts

Zwischen einer SSD und einer HDD liegen Welten. Diese Wahl ist entscheidend, da sie die Geschwindigkeit des Betriebssystems und der Programme sowie die Sicherheit unserer Dateien bestimmt.

**HDD (Festplatte):** Aufgrund der Kosten und der Langlebigkeit bei längerer Nichtbenutzung eignet sie sich hervorragend für die langfristige Massenspeicherung von Dateien, ist jedoch deutlich langsamer. Für diese Laufwerke ist **`ext4`** die Standard- und zugleich schnellste Option; es handelt sich um ein ausgereiftes, robustes und sehr effizientes Dateisystem, das ideal für Server oder Dauerbetrieb geeignet ist.

**SSD (Solid-State-Drive):** Sie bietet extrem hohe Geschwindigkeiten und sofortige Zugriffszeiten, allerdings können Flash-Speicher an Qualität verlieren oder Daten einbüßen, wenn sie über längere Zeiträume nicht mit Strom versorgt werden. Um die Leistungsfähigkeit optimal zu nutzen und die Datenintegrität zu gewährleisten, ist **`btrfs`** die beste Wahl. Auch wenn die Leistung im Vergleich zu `ext4` minimal geringer ausfallen kann, ist dieser kleine Nachteil bei einem PC absolut gerechtfertigt: Man erhält ein äußerst robustes System mit Snapshot-Funktion, die es ermöglicht, bei Fehlern oder misslungenen Updates den Zustand des Systems zu einem früheren Zeitpunkt wiederherzustellen.

### Netzwerk

Anfang der 2000er Jahre waren Windows und macOS Linux hinsichtlich der **Geschwindigkeit bei der Netzwerkerkennung und der Wiederverbindungszeit in WLAN-Netzwerken** weit überlegen. Unter Linux war dieser Prozess manuell und langsam, bedingt durch die Fragmentierung von Skripten und die direkte Nutzung von Daemons wie `wpa_supplicant`. Im Jahr 2004 führte Red Hat **NetworkManager** ein, um den Vorgang zu automatisieren und eine wettbewerbsfähige Benutzererfahrung zu bieten – auch wenn intern weiterhin `wpa_supplicant` als Authentifizierungs-Engine zum Einsatz kam.

Erst mit der Einführung von **iwd** (_iNet wireless daemon_), entwickelt von Intel, vollzog Linux einen entscheidenden Sprung bei der Geschwindigkeit von Scan- und Authentifizierungsvorgängen: Als **deutlich schlankere, optimierte und von komplexen Abhängigkeiten freie Lösung** interagiert iwd direkt mit dem `nl80211`-Subsystem des Linux-Kernels. Dies ermöglicht minimale Verbindungszeiten und übertrifft herkömmliche Netzwerk-Stacks sogar an Agilität.

Die Lösung der WLAN-Problematik durch `iwd` deckte jedoch nur einen Teil des Problems ab: Die beim Surfen wahrgenommene Latenz hing weiterhin von **DNS und der Netzwerkkonfiguration** ab. Jahrelang war Linux auf die statische Datei `/etc/resolv.conf` angewiesen, die von Netzwerkmanagern oft eher ungeschickt überschrieben wurde. Um diesen Prozess zu beschleunigen, wurden Zwischenschichten wie `systemd-resolved` oder `dnsmasq` eingeführt, was jedoch den Datenfluss komplexer gestaltete.

Hier kommt **Knot Resolver (`kresd`)** ins Spiel: Er fungiert als **rekursiver DNS-Resolver mit persistentem Cache sowie modernster, nativer Unterstützung für DNS-over-TLS (DoT) und DNSSEC**. Durch den Wegfall redundanter Abfragen und die extrem schnelle Auflösung wird die Latenz beim ersten Netzwerk-„Handshake“ auf Millisekunden reduziert; damit verschwindet der letzte Flaschenhals, der den traditionellen Linux-Netzwerk-Stack belastete.

Die Optimierung von Diensten beschränkt sich jedoch nicht auf das Netzwerk. Über Jahrzehnte hinweg war das Audio-Subsystem unter Linux zwischen ALSA, PulseAudio und JACK fragmentiert, was bei professionellen Audioanwendungen oder beim Medien-Streaming zu hohen Latenzen und Konflikten führte. Die Einführung von **PipeWire** markierte einen Meilenstein in der Systemarchitektur: ein vereinheitlichter Audio- und Video-Server, der Datenströme mittels eines beschleunigten Knotengraphen in Echtzeit verarbeitet. Durch den Ersatz veralteter Zwischenschichten durch eine schlanke, in C geschriebene Engine reduzierte PipeWire die Latenz auf ein für den Menschen nicht mehr wahrnehmbares Maß und eliminierte unnötige CPU-Last. So wird sichergestellt, dass der Multimedia-Bereich ebenso agil reagiert wie der Netzwerk-Stack.

### Kompression

Wir sind nicht mehr strikt durch die physischen Kapazitäten unserer Hardware eingeschränkt: Heute ist es möglich, Arbeitsspeicher und Speicherplatz zu „erweitern“ – auf Kosten einer minimalen CPU-Belastung.

An erster Stelle steht hierbei die **RAM-Kompression**, die es ermöglicht, Programme sofort einsatzbereit im Speicher zu halten. Dank der `zram`-Technologie benötigen Daten weniger Platz, sodass größere Mengen verarbeitet werden können. Allerdings gibt es Grenzen: Würde der Speicher vollständig komprimiert, bliebe kein Platz für die Dekomprimierung, und das System würde abstürzen. Als Ausweichmöglichkeit dient hier der Festplattenspeicher, der sogenannte `swap`, welcher dedizierten Speicherplatz als Reserve bereitstellt.

Wenn der Arbeitsspeicher jedoch vollständig erschöpft ist, reagiert der herkömmliche „Out-of-Memory“ (OOM)-Manager des Kernels oft zu spät. Um dies zu verhindern, setzt die Community auf **`earlyoom`**, ein Tool, das die Speicherdruck-Metriken des Kernels überwacht. Sobald das System an seine Grenzen stößt, greift `earlyoom` innerhalb von Millisekunden ein – noch bevor die Benutzeroberfläche einfriert. Ebenso spielt die Komprimierung der **Dateien** eine Rolle – sie bildet tatsächlich die Grundlage des ISO-Abbilds –, doch eine zu starke Komprimierung erfordert mehr Rechenleistung bei nur geringfügiger Verbesserung. Genau hier glänzt der **`zstd`**-Algorithmus, der die perfekte Balance findet: Er komprimiert schnell, spart Speicherplatz und benötigt nur ein Minimum an Rechenleistung.

### Kernel

Hier kommt unser Herzstück ins Spiel: der **Linux-Kernel**, der den grundlegenden Code für die Kommunikation mit der Hardware enthält. Er ist auf maximale Gesamtleistung und Systemfairness optimiert – ideal für Server, bietet jedoch im persönlichen Gebrauch oder auf dem Desktop unter Umständen nicht das beste Reaktionsverhalten.

Um hier Abhilfe zu schaffen, entwickelte die Community **`linux-zen`**, eine Variante, die auf die Verringerung von Latenzen und die Priorisierung interaktiver Benutzeraufgaben ausgelegt ist. Lange Zeit galt dies als die bevorzugte Wahl für Desktop-Systeme und Gaming.

Die Distribution CachyOS zeigte jedoch mit der Entwicklung von **`linux-cachyos`**, dass noch Raum für Verbesserungen bestand. Dieser Kernel optimiert die Interaktivität mithilfe des Prozess-Schedulers **BORE** (_Burst-Oriented Response Enhancer_) und kompiliert die Binärdateien unter voller Ausnutzung der Erweiterungen jeweiliger CPU-Architekturen (wie x86-64-v3 und v4), was zu einer überlegenen Leistung führt.

### Repositories

Genau um diese Prozessorarchitektur optimal zu nutzen, werden in der Pacman-Konfiguration (`/etc/pacman.conf`) spezielle, optimierte Repositories definiert und über den Standard-Repositories der Distribution platziert. Dies ermöglicht die Bereitstellung von Binärdateien, die für moderne Befehlssätze (wie x86-64-v3 oder v4) kompiliert wurden, während der Zugriff auf den riesigen Katalog des AUR uneingeschränkt erhalten bleibt.

### Display-Server

All diese Optimierungen von Hardware und Diensten wären sinnlos, wenn die visuelle Ebene weiterhin unter den Engpässen der Vergangenheit leiden würde. Über drei Jahrzehnte hinweg fungierte der Grafikserver X11 als schwerfällige Zwischeninstanz zwischen Anwendungen und GPU, was zu Problemen wie _Screen Tearing_, Rendering-Verzögerungen und Latenzen bei Eingabeereignissen führte. Die konsequente Einführung von **Wayland** hat die visuelle Architektur grundlegend neu definiert: Durch den Wegfall des zwischengeschalteten Servers kommuniziert der Compositor (wie etwa Hyprland oder Sway) direkt mit dem Grafik-Subsystem des Linux-Kernels (DRM/KMS). Das Ergebnis ist ein Erlebnis, bei dem „jeder Frame perfekt ist“ – wodurch CPU-Ressourcen frei werden, der Energieverbrauch bei Laptops optimiert wird und die grafische Benutzeroberfläche unmittelbar auf Gesten und Bewegungen des Nutzers reagiert.

## Ökosystem

Und schließlich: Personalisierung und Kontrolle. Dies ist der Hauptgrund für die Entstehung von Distributionen: ein sofort einsatzbereites und visuell stimmiges Ökosystem bereitzustellen.

Um das Jahr **1991** entstand **Qt**, geschrieben in **C++**. Es erlangte große Beliebtheit durch seine Plattformunabhängigkeit sowie die Philosophie der Entwickler, hochattraktive und anpassbare Benutzeroberflächen zu ermöglichen, ohne dabei Einbußen bei der Leistung hinnehmen zu müssen.

Im Jahr **1997** wurde **GTK** (geschrieben in **C**) ins Leben gerufen, ursprünglich konzipiert, um dem Bildbearbeitungsprogramm GIMP Leben einzuhauchen. Schnell entwickelte es sich zur bevorzugten Grafik-Engine für das **GNOME**-Projekt, wobei der Fokus auf Einfachheit, Modularität sowie einer klaren und zielgerichteten Benutzererfahrung lag.

Im Jahr **2020** erschien **GTK4** mit einer neuen, auf Leistung ausgerichteten Architektur, die GPU-Beschleunigung (Vulkan und OpenGL) nutzt. Damit wurden die Design-Prinzipien von GNOME neu definiert und Bibliotheken wie _Libadwaita_ eingeführt, um anpassungsfähige und konsistente Benutzeroberflächen zu gewährleisten.

## Benutzeroberfläche (UI)

1996 wurde das KDE-Projekt gegründet, das Qt als technische Basis wählte. Ein wesentlicher Vorteil liegt darin, dass durch die Verwendung einer einheitlichen Qt-Umgebung der Speicherverbrauch optimal gestaltet wird, da sich System und Anwendungen dieselben, im Arbeitsspeicher (RAM) geladenen Bibliotheken teilen.

Mit dem Übergang zu Wayland etablierte sich **Waybar** (basierend auf C++ und GTK, entwickelt **2018**) als Standard-Statusleiste für Compositor und Tiling-Window-Manager (wie Sway und Hyprland).

Im Jahr **2023** entstand das Projekt **QuickShell**, das in der „Ricing“-Community (der Szene für visuelle Anpassungen) für einen enormen Aufschwung sorgte: Es ermöglicht die native Erstellung von Leisten, Widgets und Systemkomponenten unter Nutzung der Leistungsfähigkeit von Qt und QML für Wayland-Window-Manager. Als Alternative innerhalb des GTK-Ökosystems entstand **2023** das Projekt **AGS** (_Aylur's GTK Shell_). Es revolutionierte die Anpassungsmöglichkeiten, indem es die Definition der Desktop-Oberfläche mittels **TypeScript/JavaScript** und CSS auf GTK-Basis ermöglichte und so die Erstellung hochdynamischer und reaktiver Widgets und Panels erleichterte.

## Zukunft

Einer der anfänglichen Vorteile von Qt war der geringe RAM-Verbrauch – zumindest bei Nutzung der vollständigen Desktop-Umgebung. Für minimalistisch orientierte Nutzer war hingegen das GTK-Ökosystem attraktiver und modularer; zudem gewann es dank der Bibliothek `gtk-rs` (GTK für Rust) aufgrund seiner Leistungsfähigkeit stark an Bedeutung. Dennoch entschied sich System76 für eine vollständige Implementierung in Rust, um die Performance weiter zu optimieren.

**COSMIC DE** ist eine vollständige Desktop-Umgebung, die von Grund auf in **Rust** geschrieben wurde. Ziel war es, die architektonischen Einschränkungen von GTK4 zu überwinden und ein extrem flüssiges, modulares sowie sicheres Wayland-Erlebnis zu schaffen. Um dieses Ökosystem zu realisieren, wurde das Framework **`libcosmic`** entwickelt (basierend auf der Rust-GUI-Bibliothek `iced`).

Gegenwärtig spaltet sich die Linux-Desktop-Landschaft klar in zwei Philosophien auf: einerseits die **reaktive Hyper-Personalisierung** durch Tools wie QuickShell oder AGS (wobei ein höherer RAM-Verbrauch durch Laufzeitumgebungen wie JS/QML in Kauf genommen wird), und andererseits **extreme Leistung und Sicherheit**, wie sie die native Entwicklung in Rust bietet.

Für viele liegt die Zukunft der Benutzeroberflächen jedoch in der **Webtechnologie** (ein Thema, das ich im nächsten Beitrag vertiefen werde). Letztlich besteht echte Leistungsfähigkeit darin, die besten Komponenten sinnvoll miteinander zu verknüpfen; in diesem Beitrag habe ich die wichtigsten vorgestellt und werde im nächsten Artikel auf jene weniger bekannten, aber dennoch fundamentalen Bausteine ​​des Ökosystems eingehen.
