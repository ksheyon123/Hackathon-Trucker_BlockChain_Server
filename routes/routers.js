var express = require('express');
var router = express.Router();

const userRouter = require('./userRouter');
const cargoRouter = require('./cargoRouter');
const mRouter = require('./mRouter');
const tokenRouter = require('./tokenRouter');

router.use(userRouter);
router.use(cargoRouter);
router.use(mRouter);
router.use(tokenRouter);

module.exports = router;
