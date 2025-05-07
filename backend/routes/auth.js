const router = require('express').Router();
const uc     = require('../controllers/userController');
const auth   = require('../middleware/auth');

router.post('/register', uc.register);
router.post('/login',    uc.login);
router.put('/password',  auth, uc.changePassword);
router.get('/me',        auth, uc.me);

module.exports = router;
