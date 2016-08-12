const J = require('joi')
const _ = require('lodash')

module.exports = function objoi (o, j) {
    if (!o || !_.isObject(o)) {
        throw new Error('An Object is required to create a new Objoi')
    }

    j = j || J.any()

    const s = J.validate(o, j)
    if (s.error) throw s.error

    switch (true) {
        case _.isArray(o):
            return new Proxy(o, {
                set (t, p, v) {
                    let n = t.slice(0)
                    n[parseInt(p)] = v
                    const r = J.validate(n, j)
                    if (r.error) throw r.error
                    t[parseInt(p)] = v
                    return true
                }
            })

        case _.isFunction(o):
            return new Proxy(o, {
                set (t, p, v) {
                    let n = Object.assign(t.bind(), t)
                    n[p] = v
                    const r = J.validate(n, j)
                    if (r.error) throw r.error
                    t[p] = v
                    return true
                }
            })

        default:
            return new Proxy(o, {
                set (t, p, v) {
                    const n = Object.assign({[p]:v},t)
                    const r = J.validate(n, j)
                    if (r.error) throw r.error
                    t[p] = v
                    return true
                }
            })
    }
}