---
title: "Configuring Arch Linux"
description: "Knowledge grows, science evolves, processes become more efficient. Your computer should be more capable, not less."
date: 2026-10-10
tags: ["linux", "optimization", "history"]
---

## My Motivation

First of all, I wanted to keep exploring new technologies and more complex architectures, but the 4 GB of RAM — which were enough to program web pages without _frameworks_ — became a limitation far too painful to tolerate. That's how I started exploring how to build myself a server from an old PC that was as minimalist as possible, so I tried **Arch Linux**.

Secondly, my ideology came into play: knowing that Linux is technically superior and that you can configure your computer exactly the way you want won me over. Fascinated by Rust making applications faster and safer, this philosophy became part of my identity.

As a final trigger, my financial situation wasn't the best. When trying to compile an application with Tauri, my laptop couldn't handle it and the fan (_heat fan_) broke. That was the moment when I decided to switch to Arch Linux as my main and only distribution.

## The black box

There were two main reasons Linux was born: the first, to have more features; the second, to have freedom, both of ownership and of decision. The first reason has allowed us to have servers and cell phones; but the second has been forgotten. I believe that offering a system that works _"out of the box"_ is a great step toward making the entry of new people much more accessible.

Arch Linux and, therefore, the **AUR** (_Arch User Repository_), today have one of the largest communities among the various distributions. This kicked off the _dotfiles_ culture, making the installation and customization of the system easier, while forcing you to learn the internal process of installing the operating system.

For its part, **CachyOS** proved that users are truly enthusiastic about performance, but that is only achieved if every part of the system is known and optimized.

## The implicit configuration

### Mounts

There is an abysmal gap between an SSD and an HDD. This choice is decisive, since it will define the speed of the operating system, the programs, and the safety of our files.

**HDD (Hard Disk Drive):** It is ideal for massive long-term file storage due to its cost and durability at rest, although it is much slower. For these drives, **`ext4`** is the standard and fastest option; it is a mature, robust, and highly efficient file system, ideal for servers or continuous storage.

**SSD (Solid State Drive):** It offers extremely high speeds and instant access, although flash memory can degrade or lose data if it goes through long periods without electrical power. To take advantage of its performance and protect data integrity, the best alternative is **`btrfs`**. Although it can have a minimal performance impact compared to `ext4`, on a personal computer this small disadvantage is completely justified: you get an ultra-robust system with snapshots that let you "travel back in time" in the face of any failure or failed update.

### Network

In the early 2000s, Windows and macOS far surpassed Linux in **Wi-Fi association speed and network reconnection time**. On Linux, the process was manual and slow due to the fragmentation of scripts and the direct use of daemons like `wpa_supplicant`. In 2004, Red Hat released **NetworkManager** to automate the process and offer a competitive user experience, although it still depended internally on `wpa_supplicant` as its authentication engine.

It wasn't until the arrival of **iwd** (_iNet wireless daemon_), developed by Intel, that Linux made a definitive leap in scanning and authentication speed: being a **much lighter, optimized solution with no complex dependencies**, it interacts directly with the `nl80211` subsystem of the Linux kernel, achieving minimal connection times and even surpassing traditional network stacks in agility.

However, solving the wireless layer with `iwd` only fixed half of the problem: the perceived latency when browsing still depended on **DNS and the network configuration**. For years, Linux relied on the static file `/etc/resolv.conf`, which used to be clumsily overwritten by network managers. To speed this up, intermediate layers like `systemd-resolved` or `dnsmasq` were introduced, but this added complexity to the data flow.

This is where **Knot Resolver (`kresd`)** comes into play. It operates as a **recursive DNS resolver with persistent caching and cutting-edge native support for DNS-over-TLS (DoT) and DNSSEC**. By eliminating redundant queries and processing resolution in an ultra-fast way, it reduces the latency of the first network 'handshake' to milliseconds, removing the last bottleneck that the traditional Linux stack had been dragging along.

However, service optimization doesn't stop at the network. For decades, the audio subsystem on Linux was fragmented among ALSA, PulseAudio, and JACK, generating high latencies and conflicts when working with professional audio or multimedia streaming. The arrival of **PipeWire** marked a milestone in the architecture of the system: a unified audio and video server that processes data streams in real time through an accelerated node graph. By replacing the old intermediate layers with a lightweight engine written in C, PipeWire reduced latency to imperceptible levels and eliminated unnecessary CPU consumption, ensuring that the multimedia side responds with the same agility as the network stack.

### Compress

We are no longer strictly limited by the physical capacity of our hardware: today it is possible to "expand" memory and storage in exchange for minimal CPU consumption.

First of all, **RAM** compression is what allows having programs ready on the table to use them. Using `zram` technology we get to occupy less and handle more data, but there is a limit: if it is compressed completely, there will be no space to decompress and the system will collapse; to prevent that we can dedicate disk to it, called `swap`, which allows reserving exclusive memory as a backup.

However, when all memory runs out, the traditional Out-Of-Memory (OOM) manager of the kernel usually acts too late. To prevent this, the community turns to **`earlyoom`**, which monitors the kernel's memory pressure metrics. When it detects that the system starts to choke, it intervenes within milliseconds before the interface freezes.

In the same way we have **file** compression, in fact this is the basis of the ISO image, but compressing too much costs more compute for only a slight improvement. This is where the **`zstd`** algorithm shines, hitting the perfect sweet spot: it compresses fast, saves space, and consumes the minimum processing.

### Kernel

Here comes our cornerstone: the **Linux kernel**, which contains the dormant code to communicate with the hardware. Optimized to maximize overall performance and the fairness of the system — something ideal for servers, but which may not offer the best response in personal or desktop use.

To fix this, the community created **`linux-zen`**, an adapted variant designed to reduce latency and give priority to the interactive tasks that the user performs. For a long time, this was the preferred option for desktop and video games.

However, the CachyOS distribution proved that there was still room for improvement by creating **`linux-cachyos`**. This kernel optimizes interactivity through the **BORE** (_Burst-Oriented Response Enhancer_) process scheduler and compiles the binaries taking full advantage of each CPU architecture's extensions (like x86-64-v3 and v4), achieving superior performance.

### Repositories

And precisely to take advantage of the architecture of the processor, these optimized repositories are defined in Pacman's configuration (`/etc/pacman.conf`), placing them above the base repositories of the distribution. This allows offering binaries compiled for modern instructions (like x86-64-v3 or v4), while keeping access to the immense AUR catalog intact.

### Display Server

All of this hardware and service optimization would be meaningless if the visual layer kept dragging along the bottlenecks of the past. For more than three decades, the X11 graphics server acted as a heavy intermediary between applications and the GPU, causing _screen tearing_, render desync, and latency in input events. The definitive adoption of **Wayland** completely redefined the visual architecture: by removing the intermediary server, the compositor itself (like Hyprland or Sway) communicates directly with the graphics subsystem of the Linux kernel (DRM/KMS). The result is an experience where "every frame is perfect," freeing up CPU cycles, optimizing consumption on laptops, and allowing the graphical interface to respond instantly to the user's gestures and movements.

## Ecosystem

And finally, customization and control. This is the main reason distributions are created: to give you an ecosystem that is ready to use and visually coherent.

Around **1991**, **Qt** was born, written in **C++**, gaining great popularity for being cross-platform and for its creators' philosophy of allowing highly attractive and customizable interfaces to be built without sacrificing performance.

In **1997**, **GTK** was created, written in **C**, conceived initially to bring the GIMP image editor to life. It quickly became the preferred graphics engine for the **GNOME** project, betting on simplicity, modularity, and a clean, focused user experience.

By **2020** comes **GTK4** with a new architecture focused on performance through GPU acceleration (Vulkan and OpenGL), redefining the rules of design in GNOME and introducing libraries like _Libadwaita_ to guarantee adaptive and coherent interfaces.

## UI

In 1996 the KDE project was founded, adopting Qt as its technical pillar. One of its greatest advantages lies in the fact that, by keeping a unified environment in Qt, memory consumption is optimized to the max, since the system and the applications share the same libraries loaded in RAM.

With the transition to Wayland, **Waybar** (based on C++ and GTK), created in **2018**, became the standard status bar for compositors and tiling window managers (like Sway and Hyprland).

In **2023** the **QuickShell** project was created, sparking an explosion in the customization (_ricing_) community by allowing bars, widgets, and system components to be built using the power of Qt and QML natively in Wayland window managers.

As an alternative within the GTK ecosystem, the **AGS** (_Aylur's GTK Shell_) project emerges in **2023**, revolutionizing customization by allowing the desktop interface to be defined using **TypeScript / JavaScript** and CSS on top of GTK, making it easier to create highly dynamic and reactive widgets and panels.

## Future

One of Qt's initial advantages was its low RAM consumption, as long as you had the full desktop; for minimalist users the GTK ecosystem was more attractive and modular, and thanks to the `gtk-rs` library (GTK in Rust), it has gained a lot of attraction for its performance, nonetheless to improve it even further System76 opted to have everything in Rust.

**COSMIC DE**, a complete desktop environment written from scratch in **Rust**. Its goal was to surpass the architectural limitations of GTK4 and achieve an ultra-fluid, modular, and secure Wayland experience. To bring this ecosystem to life, they developed the **`libcosmic`** framework (based on Rust's GUI library `iced`).

Nowadays, the desktop gap in Linux has clearly split between two philosophies: **reactive hyper-customization** through tools like QuickShell or AGS (assuming a higher RAM consumption when running runtimes like JS/QML), versus the **extreme performance and security** offered by native development in Rust.

However, for many the interface of the future lies in **web technology** (a topic I will dig into in the next post). On the other hand, true performance consists of knowing how to connect and assemble the best pieces; in this post I have highlighted the most important ones, leaving for the next publication those rarely seen but fundamental pieces of the ecosystem.
