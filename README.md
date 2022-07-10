# Sdeno

> Sdeno, Steno on Deno\
> Specialized fast async file writer

**Sdeno** makes writing to the same file often/concurrently fast and safe.

## Original Project

This project is a [Deno](https://deno.land) "wrapper" for [Steno](https://github.com/typicode/steno) (by [typicode](https://github.com/typicode)).

## Installation

Because this is a Deno wrapper, you need to import it from this URL like that:

```js
import { Writer } from 'https://deno.land/x/steno/mod.ts';
```

## Usage

For usage, see [Steno Usage](https://github.com/typicode/steno).

## Benchmark

`deno task bench` (see `src/benchmark.ts`)

Benchmark results are a little different [from the original project](https://github.com/typicode/steno#benchmark) because here we're using Deno instead of Node.js.

```
Write 1KB data to the same file x 1000
  fs     :  462ms
  steno  :    4ms

Write 1MB data to the same file x 1000
  fs     : 2551ms
  steno  :    7ms
```

_Sdeno (as Steno) uses a smart queue and avoids unnecessary writes._

---

\
_**Warning:** Benchmark can vary depending on the machine and the OS you're using._
