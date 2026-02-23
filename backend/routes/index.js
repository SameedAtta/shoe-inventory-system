const express = require('express');
const router = express.Router();

const companyRouter = require('./companyRoutes');
const productRouter = require('./productRoutes');
const userRouter = require('./userRoute');
const dashboardRouter = require('./dashboardRoute');
const saleRouter = require('./saleRoutes');

router.use('/company', companyRouter);
router.use('/products', productRouter);
router.use('/dashboard', dashboardRouter);
router.use('/user', userRouter);
router.use('/sales', saleRouter);


module.exports = router;

