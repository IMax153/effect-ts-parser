---
title: ChunkTarget.ts
nav_order: 2
parent: Modules
---

## ChunkTarget overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [ChunkTarget (interface)](#chunktarget-interface)
- [utils](#utils)
  - [ChunkTarget (namespace)](#chunktarget-namespace)
    - [Capture (interface)](#capture-interface)

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

# utils

## ChunkTarget (namespace)

Added in v1.0.0

### Capture (interface)

**Signature**

```ts
export interface Capture<Output> {
  readonly subBuilder: Array<Output>
}
```

Added in v1.0.0
