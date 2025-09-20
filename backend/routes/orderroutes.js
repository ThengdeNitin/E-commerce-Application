import express from 'express';
import {
    createOrder,
    createWishlist,
    getWishlist,        // fixed name
    createBag,
    getBag,             // fixed name
    updateBagQty,       // fixed name
    deleteBagItem,      // fixed name
    deleteWishlistItem  // fixed name
} from '../controllers/ordercontroller.js';

const router = express.Router();

// Orders
router.post('/orders', createOrder);

// Wishlist
router.post('/wishlists', createWishlist);
router.get('/wishlists/:id', getWishlist);
router.delete('/wishlists/:id/:productId', deleteWishlistItem);

// Bag / Cart
router.post('/bags', createBag);
router.get('/bags/:id', getBag);
router.put('/bags/:id', updateBagQty);
router.delete('/bags/:id/:productId', deleteBagItem);

export default router;
