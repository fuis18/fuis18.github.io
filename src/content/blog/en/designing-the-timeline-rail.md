---
title: "Designing the timeline rail"
description: "How the alternating desktop layout works"
date: 2026-02-15
tags: ["css", "design"]
readingTime: 6
---

On desktop the rail sits in the middle of the container and the cards alternate
around it. On mobile the rail moves to the left and the entries stack.

- `data-side="start"` places the card on the left.
- `data-side="end"` places it on the right.
- The dot never lands at the top, the middle or the bottom of its entry.
