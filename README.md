# objoi

[![Build Status](https://api.travis-ci.org/jpwilliams/objoi.svg)](https://travis-ci.org/jpwilliams/objoi) [![Coverage Status](https://coveralls.io/repos/github/jpwilliams/objoi/badge.svg?branch=master)](https://coveralls.io/github/jpwilliams/objoi?branch=master) [![Dependencies](https://img.shields.io/david/jpwilliams/objoi.svg)]()

Using ES2015's new [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object and the power of [joi](https://github.com/hapijs/joi), validate input to native JS objects, arrays and functions.

``` js
// Load dem modules
var objoi = require('objoi')
var joi = objoi.joi

// Make `foo` an object with a schema
var foo = objoi({}, joi.object().keys({
    bar: joi.boolean()
}))

// Throws error: "bar" must be a boolean
foo.bar = 'baz'

// Lets it happen
foo.bar = true
```

## Why did you do this?

I don't know yet. I mean, it's gotta be useful for _something_, right?

## Anything else?

`objoi` also exposes `objoi.joi` which you can use to create schemas with in case you don't want to add two dependencies for a single module.

## I want a slowly-typed, animated example

[![asciicast](https://asciinema.org/a/631ewhm87r6346v3qmidfqxqt.png)](https://asciinema.org/a/631ewhm87r6346v3qmidfqxqt)
