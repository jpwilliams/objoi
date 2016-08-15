function objoi (obj, schema = objoi.joi.any()) {
    const type = typeof obj

    if (!obj || (type !== 'object' && type !== 'function')) {
        throw new Error('An Object is required to create a new Objoi')
    }

    const test = objoi.joi.validate(obj, schema)
    if (test.error) throw test.error

    const validate = function validate (target, property, value) {
        let copy

        if (Array.isArray(obj)) {
            copy = target.slice(0)
        } else if (type === 'function') {
            copy = Object.assign(target.bind(), target)
        } else {
            copy = Object.assign({}, target)
        }

        copy[property] = value
        const ret = objoi.joi.validate(copy, schema)
        if (ret.error) throw ret.error
        target[property] = value
        return true
    }

    return new Proxy(obj, {
        set (target, property, value) {
            return validate(target, property, value)
        }
    })
}

objoi.joi = require('joi')

module.exports = objoi