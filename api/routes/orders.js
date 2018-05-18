const router = require('express').Router();

const checkAuth = require('../middleware/checkAuth');
const orderController = require('../controllers/orders');

router.get('/', checkAuth, orderController.orders_get_all);

router.post('/', checkAuth, orderController.orders_create_order);

router.get('/:orderId', checkAuth, orderController.orders_get_a_order);

router.delete('/:orderId', checkAuth, orderController.orders_delete_order);

module.exports = router;