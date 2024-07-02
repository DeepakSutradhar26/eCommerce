const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

// Create Product 
exports.createProduct = catchAsyncError(
  async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      product
    })
  }
);


// Get all products
exports.getAllProducts = catchAsyncError(
  async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
      .search()
      .filtery()
      .pagination(resultPerPage);
    const products = await apiFeatures.query;

    res.status(201).json({
      success: true,
      products,
      productCount,
    })
  }
);

// Update product -- Admin
exports.updateProduct = catchAsyncError(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true, useFindAndModify: false
    });
    await product.save();

    res.status(200).json({
      success: true,
      product
    })
  }
);

// Delete product -- Admin
exports.deleteProduct = catchAsyncError(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted"
    })
  }
);

// Get product details
exports.getProductDetails = catchAsyncError(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product
    })
  }
);

//Create new review or update review
exports.productReview = catchAsyncError(async (req, res, next) => {
  const { comment, productId, rating } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }
  const product = await Product.findById(productId);
  const isReviewed = await product.reviews.find(rev =>
    rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  var avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isReviewed ? "Review has been updated" : "Review has been added",
  });
});

//Get All reviews of product
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product does not exist", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
});

//Delete reviews
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product does not exist", 404));
  }

  const reviews = product.reviews
    .filter((rev) => rev._id.toString() !== req.query.id.toString());
  var avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length > 0 ? reviews.length : 1;
  const numOfReviews = reviews.length > 0 ? reviews.length : 0;
  await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
  })
});