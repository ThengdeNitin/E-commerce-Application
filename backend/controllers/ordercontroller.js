import A from "../middlewares/resolveAndCatch.js";
import Order from "../models/ordermodel.js";
import Wishlist from "../models/wishlist.js";
import Bag from "../models/bag.js";
import ErrorHandler from "../utils/errorHandel.js";

// ======================= ORDERS =======================
export const createOrder = A(async (req, res, next) => {
  const { user, orderItems, totalPrice, shippingAddress, paymentInfo } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("No order items provided", 400));
  }

  const order = await Order.create({
    user,
    orderItems,
    totalPrice,
    shippingAddress,
    paymentInfo,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// ======================= WISHLIST =======================
export const createWishlist = A(async (req, res, next) => {
  const { user, orderItems } = req.body;

  let wishlist = await Wishlist.findOne({ user });

  if (wishlist) {
    const exists = wishlist.orderItems.some(
      (item) => item.product.toString() === orderItems[0].product
    );

    if (exists) {
      return next(new ErrorHandler("Product already added in Wishlist", 400));
    }

    await Wishlist.updateOne({ user }, { $push: { orderItems: orderItems[0] } });
  } else {
    wishlist = await Wishlist.create(req.body);
  }

  res.status(200).json({ success: true });
});

export const getWishlist = A(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.params.id }).populate(
    "orderItems.product"
  );

  res.status(200).json({
    success: true,
    wishlist,
  });
});

export const deleteWishlistItem = A(async (req, res, next) => {
  const { user, product } = req.body;

  await Wishlist.updateOne(
    { user },
    { $pull: { orderItems: { product } } }
  );

  res.status(200).json({ success: true });
});

// ======================= BAG =======================
export const createBag = A(async (req, res, next) => {
  const { user, orderItems } = req.body;

  let bag = await Bag.findOne({ user });

  if (bag) {
    const exists = bag.orderItems.some(
      (item) => item.product.toString() === orderItems[0].product
    );

    if (exists) {
      return next(new ErrorHandler("Product already added in Bag", 400));
    }

    await Bag.updateOne({ user }, { $push: { orderItems: orderItems[0] } });
  } else {
    bag = await Bag.create(req.body);
  }

  res.status(200).json({ success: true });
});

export const getBag = A(async (req, res, next) => {
  const bag = await Bag.findOne({ user: req.params.id }).populate(
    "orderItems.product"
  );

  res.status(200).json({
    success: true,
    bag,
  });
});

export const updateBagQty = A(async (req, res, next) => {
  const { id, qty } = req.body;

  await Bag.updateOne(
    { "orderItems._id": id },
    { $set: { "orderItems.$.qty": qty } }
  );

  res.status(200).json({ success: true });
});

export const deleteBagItem = A(async (req, res, next) => {
  const { user, product } = req.body;

  await Bag.updateOne(
    { user },
    { $pull: { orderItems: { product } } }
  );

  res.status(200).json({ success: true });
});
