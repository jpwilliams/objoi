const J = require('joi')

module.exports = function objoi (o, j) {
    const y = typeof o

    if (!o || (y !== 'object' && y !== 'function')) {
        throw new Error('An Object is required to create a new Objoi')
    }

    j = j || J.any()

    const s = J.validate(o, j)
    if (s.error) throw s.error

    switch (true) {
        case Array.isArray(o):
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

        case (y === 'function'):
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
                    let n = Object.assign({},t)
                    n[p] = v
                    const r = J.validate(n, j)
                    if (r.error) throw r.error
                    t[p] = v
                    return true
                }
            })
    }
}