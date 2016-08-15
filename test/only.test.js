var objoi = require('../index')
var joi = objoi.joi

describe('objoi', function () {
    it('should expose the objoi function', function () {
        expect(objoi).to.be.a('function')
    })

    it('should expose joi', function () {
        expect(joi).to.be.an('object')
        expect(joi.isJoi).to.equal(true)
    })

    it('should throw if no object provided', function () {
        expect(objoi).to.throw()
    })

    it('should throw if provided arg is not an object', function () {
        expect(function () {
            var foo = objoi('test')
        }).to.throw('An Object is required to create a new Objoi')
    })

    it('should return an objoi object', function () {
        var foo = objoi({bar: 'baz'})

        expect(foo).to.be.an('object')
        expect(foo).to.include.keys('bar')
        expect(foo.bar).to.equal('baz')
    })

    it('should not allow invalid objects on start', function () {
        expect(function () {
            var foo = objoi({bar: 'baz'}, {bar: joi.boolean()})
        }).to.throw('"bar" must be a boolean')
    })

    it('should allow setting the bar property', function () {
        var foo = objoi({bar: 'baz'})
        foo.bar = 'qux'
    })

    it('should fail on invalid second assignment (object)', function () {
        var foo = objoi({}, {
            bar: joi.string().max(3)
        })

        expect(function () {
            foo.bar = 'baz'
        }).to.not.throw()

        expect(foo.bar).to.equal('baz')

        expect(function () {
            foo.bar = 'quux'
        }).to.throw('must be less')
    })

    it('should fail on invalid second assignment (array)', function () {
        var foo = objoi([], joi.array().items(
            joi.string().max(3)
        ))

        expect(function () {
            foo[0] = 'baz'
        }).to.not.throw()

        expect(foo[0]).to.equal('baz')

        expect(function () {
            foo[0] = 'quux'
        }).to.throw('must be less')
    })

    it('should disallow setting the baz property to a string', function () {
        var foo = objoi({}, {
            baz: joi.boolean()
        })

        expect(function () {
            foo.baz = 'test'
        }).to.throw('"baz" must be a boolean')
    })

    it('should not allow unknown properties', function () {
        var foo = objoi({}, joi.object().keys({}))

        expect(function () {
            foo.bar = 'test'
        }).to.throw('"bar" is not allowed')
    })

    it('should allow arrays', function () {
        var foo = objoi([])
        foo.push('test')
        expect(foo[0]).to.equal('test')
    })

    it('should check array limits', function () {
        var foo = objoi(['foo'], joi.array().max(2))

        expect(function () {
            foo.push('bar')
        }).to.not.throw()

        expect(function () {
            foo.push('baz')
        }).to.throw('must contain less')

        expect(foo.length).to.equal(2)
    })

    it('should check object limits', function () {
        var foo = objoi({bar: 'baz'}, joi.object().max(2))

        expect(function () {
            foo.baz = 'qux'
        }).to.not.throw()

        expect(function () {
            foo.qux = 'quux'
        }).to.throw('must have less')

        expect(Object.keys(foo).length).to.equal(2)
    })

    it('should allow functions', function () {
        var foo = objoi(function () {}, joi.func())

        expect(foo).to.be.a('function')
    })

    it('should check function keys', function () {
        var foo = objoi(function () {}, joi.func().max(1))

        expect(function () {
            foo.baz = 'qux'
        }).to.not.throw()

        expect(function () {
            foo.qux = 'quux'
        }).to.throw('must have less')

        expect(Object.keys(foo).length).to.equal(1)
    })
})