const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

//Create new order
exports.createNewOrder = catchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        user,
        paymentInfo,
        paidAt,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        user,
        paymentInfo,
        paidAt,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    })
});

//Get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order
    })
});

//Get logged in user orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
});

//Get all orders -- Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmt = 0;

    orders.forEach((order) => {
        totalAmt += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmt,
        orders
    })
});

//Update order status -- Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order does not exist", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You already delivered this order", 400));
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    });
    order.orderStatus = req.body.status;
    if (order.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }
    order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    })
});

//Function to update stock
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

//Delete order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order does not exist", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted"
    })
});