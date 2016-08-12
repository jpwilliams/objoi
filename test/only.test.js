var objoi = require('../index')
var Joi = require('joi')

describe('objoi', function () {
    it('should expose the objoi function', function () {
        expect(objoi).to.be.a('function')
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
            var foo = objoi({bar: 'baz'}, {bar: Joi.boolean()})
        }).to.throw('"bar" must be a boolean')
    })

    it('should allow setting the bar property', function () {
        var foo = objoi({bar: 'baz'})
        foo.bar = 'qux'
    })

    it('should disallow setting the baz property to a string', function () {
        var foo = objoi({}, {
            baz: Joi.boolean()
        })

        expect(function () {
            foo.baz = 'test'
        }).to.throw('"baz" must be a boolean')
    })

    it('should not allow unknown properties', function () {
        var foo = objoi({}, Joi.object().keys({}))

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
        var foo = objoi(['foo'], Joi.array().max(2))

        expect(function () {
            foo.push('bar')
        }).to.not.throw()

        expect(function () {
            foo.push('baz')
        }).to.throw('must contain less')

        expect(foo.length).to.equal(2)
    })

    it('should check object limits', function () {
        var foo = objoi({bar: 'baz'}, Joi.object().max(2))

        expect(function () {
            foo.baz = 'qux'
        }).to.not.throw()

        expect(function () {
            foo.qux = 'quux'
        }).to.throw('must have less')

        expect(Object.keys(foo).length).to.equal(2)
    })

    it('should allow functions', function () {
        var foo = objoi(function () {}, Joi.func())

        expect(foo).to.be.a('function')
    })

    it('should check function keys', function () {
        var foo = objoi(function () {}, Joi.func().max(1))

        expect(function () {
            foo.baz = 'qux'
        }).to.not.throw()

        expect(function () {
            foo.qux = 'quux'
        }).to.throw('must have less')

        expect(Object.keys(foo).length).to.equal(1)
    })
})