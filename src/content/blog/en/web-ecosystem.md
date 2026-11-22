---
title: Web Ecosystem
description: Open it in your notes blog, write it in HTML, open it in your browser — your web page, a shot of dopamine where the passion of many began
date: 2026-11-21
tags: ["blink", "gecko", "webkit"]
---

Is building web pages the solution for cross-platform apps with beautiful design? It turns out there are still websites that tell you: "Chrome or Brave only."

## The Browser Wars

In the early nineties, the web consisted of text documents linked to one another. Everything changed in 1993 with **NCSA Mosaic**, the first browser to popularize images embedded within pages: for the first time, browsing was also about looking. Among its creators was Marc Andreessen, who shortly afterwards left to co-found Netscape, taking with him the conviction that the browser was the gateway to the network.

At the end of 1994, **Netscape Navigator** was born — a browser that offered a faster visual experience than its competitors, just as three decisive factors converged: the popularization of inexpensive personal computers, commercial Internet access for homes and businesses, and the ability to download it on different operating systems. Thanks to that combination, in less than two years it reached **more than 80% market share**, leaving emerging competitors behind.

In 1995 Microsoft launched its strategy: Windows 95 shipped with **Internet Explorer** preinstalled, thanks to exclusivity contracts with OEM manufacturers that prevented the distribution of competitors' browsers. Moreover, Microsoft gave its browser away for free, stripping Netscape of its main source of income: against a competitor that didn't need to sell anything, the battle over features became impossible to win.

Fearing that Microsoft would end up dominating the web, Netscape responded in December 1995 by launching **JavaScript**, a language designed to bring web pages to life and make any site work the same in any browser. It was the gateway to an ambitious ideal: that the browser could run applications on any operating system, without asking Windows for permission. That drive to fill the web with life would, paradoxically, end up in the hands of a small animation tool.

In May 1996, FutureWave Software developed **FutureSplash Animator**, a lightweight vector animation tool for the web. It generated files so small they could be downloaded in seconds — ideal for an era of 28.8 kbps phone lines — and put animation within reach of any creator without expensive servers or advanced programming. That same year, in December, **Macromedia** bought FutureWave and renamed it **Macromedia Flash 1.0**.

### The flourishing of content and total dominance

Starting in 1998, **Newgrounds** — the platform created by Tom Fulp for publishing animations and games made with **Flash** — grew popular. By eliminating the need for expensive servers or advanced programming, the tool cheapened interactive content and gave rise to a vibrant culture of amateur creators and viral humor that defined the web for the next fifteen years.

With the launch of **Windows 98**, Internet Explorer was deeply integrated into the core of the operating system, a move that triggered an immediate reaction from regulators: that same year, the U.S. Department of Justice and several states filed a historic antitrust lawsuit, accusing Microsoft of abusing its dominant position by tying the two products together. The impact on Netscape was devastating: unable to stop its decline, the company was absorbed by AOL at the end of 1998.

In September 1998, two Stanford doctoral students, **Larry Page and Sergey Brin**, founded **Google**. Their bet was unrelated to the war underway: instead of giving away browsers or tying products to operating systems, they set out to organize the chaos of the web with their PageRank algorithm, sustained by search advertising — a business that could only thrive if the web remained open and neutral.

From that open web would also emerge a key piece that nobody valued at the time. In October 2000, **KHTML** was released publicly alongside **KDE 2.0**. It was developed by the KDE project (initially led by Lars Knoll and Waldo Bastian) as the successor to the `khtmlw` engine, to give Linux a lightweight browser compatible with modern standards: HTML 4, CSS, and JavaScript through its sibling engine **KJS**.

Internet Explorer's dominance, meanwhile, peaked: by 2002 it held around **96%** of the market. Netscape, however, had released its source code in 1998 under the **Mozilla project** before falling, surviving until then on marginal support.

### The rebirth of competition

Around the same time, **Epiphany** was born as a fork of the earlier Galeon browser, following a dispute among developers over keeping it simple.

On November 9, 2004, **Firefox** was launched, two years after that code release: an independent browser focused solely on browsing and much lighter. It was developed under the umbrella of the Mozilla Foundation (created in 2003 with Mitchell Baker at the helm) and the Mozilla Corporation (founded in 2005 for its development and commercialization through agreements with search engines).

In February 2005, **YouTube** was born. It triumphed over earlier video sites because it used **Macromedia Flash Player** to play videos directly inside the browser, solving the fragmentation of formats and codecs without installing anything.

Also at that time, Apple adopted the KHTML engine to build Safari, renaming it **WebKit** and polishing it until it became the foundation of Mac browsers and, later, of the iPhone.

In December 2005, Adobe completed its acquisition of Macromedia, integrating Flash into its creative suite and bringing together, under one roof, the giant of design tools and the king of interactive web content.

### Chrome and the standardization of engines

The blow came in 2008, when Google introduced **Chrome**, built on WebKit with a new engine, JavaScript V8. Chrome arrived with new ideas that forced the entire industry to improve: separate processes for each tab, an isolated environment or sandbox for security, and an omnibox that combined searches and addresses. Google also released the project as open source through Chromium, and its silent automatic updates helped new features reach users quickly.

Epiphany, GNOME's browser, had for years suffered from depending on Gecko: the release cycles of both projects never aligned, and Firefox looked increasingly like an internal Mozilla component rather than a base for third parties. To solve this, in July 2007 its team added WebKit as an alternative engine, and on April 1, 2008, it announced it would abandon Gecko altogether; the migration was completed with the version included in GNOME 2.28, released in September 2009. The underlying message was clear: the web was standardizing, and so were its engines.

### The decline of Flash and privacy as a banner

In 2010, Apple **blocked Flash** on the iPhone and iPad, citing performance, battery, and security problems. Steve Jobs published an open letter that year titled "Thoughts on Flash," explaining that a technology conceived in the PC era did not fit the mobile era of touchscreens and limited battery life, and defended open standards (HTML5, CSS3, WebGL) as the way forward.

Around 2011, it became clear that websites could identify every visitor without cookies through _fingerprinting_: traits such as installed fonts, screen resolution, or plugins formed an almost unique signature, and unlike a cookie, it could not be deleted. In response, the Tor Project built **Tor Browser** as a hardened fork of Firefox. Its goal was radical: to make all users look identical to one another, so that privacy was born from the browser itself.

### The era of Chromium

In 2013, Google forked WebKit and created **Blink**, its own branch of the rendering engine. The split was largely due to Chrome's multiprocess architecture and its performance needs diverging ever further from the direction Apple wanted to take WebKit. That same year, Opera abandoned its own engine to adopt Blink, leaving the landscape divided into two great families: the one derived from KHTML (WebKit and Blink) and Gecko, maintained by Mozilla.

Windows 10, launched in 2015, debuted with **Microsoft Edge**, the successor to Internet Explorer, equipped with its own rendering engine, **EdgeHTML**, and the JavaScript engine Chakra. But a web built in Chrome's image turned every incompatibility into lost users, and in December 2018 Microsoft announced it would rebuild Edge on Chromium.

**Brave** was born in 2016 as a beta phase, founded by **Brendan Eich**, co-author of JavaScript and brief CEO of Mozilla, along with Brian Bondy, also formerly of Mozilla. It reached version 1.0 on November 13, 2019, already featuring ad and tracker blocking by default and private windows with Tor.

**Microsoft Edge**, heir to that victorious Internet Explorer, sealed the shift in 2020. With that, three of today's dominant browsers (Chrome, Edge, and Opera) came to share the same engine family, leaving Mozilla Firefox as the only independent stronghold.
