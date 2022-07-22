const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon')
const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function () {
    it('should throw an error if no authorization header is present', function() {
        const req= {
            get: function(headerName) {
                return null;
            }
        };
        expect(authMiddleware.bind(this,req, {}, () => {})).to.throw('Not Authenticated.');
    });
    
    
    it('it should throw an error if authorization is only one string', function() {
        const req= {
            get: function(headerName) {
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=> {})).to.throw();
    });

    it ('it should yield a userId after decoding the token', function () {
        const req= {
            get: function(headerName) {
                return 'Bearer ksbafjkbsejkfbdjsk';
            }
        };
        sinon.stub(jwt, 'verify');

        jwt.verify.returns({userId: 'abc'}) ;
        authMiddleware(req, {}, ()=> {});
        expect(req).to.have.property('userId');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });

    it ('should throw an error if the token can not be verified', function () {
        const req= {
            get: function(headerName) {
                return 'Bearer xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    

})
