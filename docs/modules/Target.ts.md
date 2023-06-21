---
title: Target.ts
nav_order: 7
parent: Modules
---

## Target overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [models](#models)
  - [Target (interface)](#target-interface)

---

# models

## Target (interface)

**Signature**

```ts
export interface Target<Capture, Output> {
  write(value: Output): void
  capture(): Capture
  emit(capture: Capture): void
  drop(capture: Capture): void
}
```

Added in v1.0.0
