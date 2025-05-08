const router = require('express').Router();
const auth   = require('../middleware/auth');
const bc     = require('../controllers/bookingController');

router.use(auth);
router.post('/',   bc.create);
router.get('/',    bc.listMy);
router.delete('/:id', bc.remove);

module.exports = router;
