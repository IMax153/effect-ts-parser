---
title: Target/Chunk.ts
nav_order: 8
parent: Modules
---

## Chunk overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [ChunkTarget (interface)](#chunktarget-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: <Output>() => ChunkTarget<Output>
```

Added in v1.0.0

# models

## ChunkTarget (interface)

**Signature**

```ts
export interface ChunkTarget<Output> extends Target<ChunkTarget.Capture<Output>, Output> {}
```

Added in v1.0.0
