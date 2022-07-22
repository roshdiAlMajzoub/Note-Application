const expect = require('chai').expect;
const sinon = require('sinon')
const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller-login', function () {
    it('it should throw error if accessing database failed', function () {
        sinon.stub(User, 'findOne');
        User.findOne.throws();
        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester1232'
            }
        };
        const res = {};
        expect(AuthController.login.bind(this,req, res, ()=> {})).to.throw();
        User.findOne.restore();
    })
})