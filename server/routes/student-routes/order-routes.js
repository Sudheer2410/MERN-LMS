const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/student-controller/order-controller");
console.log('orderController:', orderController);
const { createOrder, capturePaymentAndFinalizeOrder } = orderController;
const enrollFreeCourseHandler = orderController.enrollFreeCourse;
console.log('enrollFreeCourseHandler:', enrollFreeCourseHandler);
const authenticate = require("../../middleware/auth-middleware");

router.post("/create-order", authenticate, createOrder);
router.post("/capture-payment", authenticate, capturePaymentAndFinalizeOrder);
// New route for free course enrollment
router.post("/enroll-free-course", authenticate, enrollFreeCourseHandler);

module.exports = router;
