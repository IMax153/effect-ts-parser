---
title: BitSet.ts
nav_order: 1
parent: Modules
---

## BitSet overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [allChars](#allchars)
  - [fromIterable](#fromiterable)
  - [make](#make)
- [models](#models)
  - [BitSet (interface)](#bitset-interface)

---

# constructors

## allChars

**Signature**

```ts
export declare const allChars: BitSet
```

Added in v1.0.0

## fromIterable

**Signature**

```ts
export declare const fromIterable: (bits: Iterable<number>) => BitSet
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: (...bits: ReadonlyArray<number>) => BitSet
```

Added in v1.0.0

# models

## BitSet (interface)

**Signature**

```ts
export interface BitSet extends ReadonlyArray<number> {}
```

Added in v1.0.0
