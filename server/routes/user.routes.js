const express = require('express');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');

const router = express.Router();

router.route('/api/signup').post(userCtrl.create);
router.route('/api/remove/:userId').delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);
router.route('/api/read/:userId').get(authCtrl.requireSignin, userCtrl.read);
router.route('/api/update/:userId').put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update);
router.route('/api/users').get(userCtrl.list);

router.param('userId', userCtrl.userById);

module.exports = router;

