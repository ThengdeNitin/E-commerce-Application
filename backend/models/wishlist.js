import mongoose from 'mongoose';
const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MynUser",
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MyntraProduct", // ✅ Make sure this matches your product model name
            required: true
        }
    ]
}, { timestamps: true });

const wish = mongoose.model("Wishlist", wishlistSchema);

export default wish;
