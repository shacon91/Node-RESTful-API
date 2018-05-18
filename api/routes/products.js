const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString()+file.originalname);
    },
});

const limits = {
    fileSize: 1024*1024*5
};

const fileFilter = function(req,file,cb){
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null,true);
    }else{
        cb(null,false);
    }
};

const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

const checkAuth = require('../middleware/checkAuth');
const productController = require('../controllers/products');

router.get('/', productController.products_get_products);

router.post('/', checkAuth, upload.single("productImage") , productController.products_create_product);

router.get('/:productId', productController.products_get_a_product);

router.patch('/:productId', checkAuth, productController.products_update_a_product);

router.delete('/:productId', checkAuth, productController.products_delete_a_product);

module.exports = router;