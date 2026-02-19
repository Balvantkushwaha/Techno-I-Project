import mongoose from "mongoose";

const { Schema } = mongoose;

// Sub-schema for Addresses
const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    pin_code: String,
    isDefault: { type: Boolean, default: false }
});

// Sub-schema for Orders (Reference or Embedded)
const orderSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    status: { type: String, default: 'Pending' },
    totalAmount: Number
}, { timestamps: true });

const userSchema = new Schema({
    userId: { type: String, unique: true }, // Custom ID: Mobile + Unix
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    mobile: { type: String, unique: true, sparse: true },
    password: { type: String, required: true , select: false}, // select: false to exclude from queries by default
    
    // Arrays for nested data
    addresses: [addressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    orders: [orderSchema],

    isVerified: { type: Boolean, default: false }
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

// Logic to create custom userId (Mobile + Unix Code)
userSchema.pre('save', function () {
    if (!this.userId) {
        const unixCode = Math.floor(Date.now() / 1000); // Current Unix Timestamp
        // Using last 4 digits of mobile + unix for a clean ID
        const mobilePart = this.mobile ? this.mobile.slice(-4) : '0000';
        this.userId = `USR-${mobilePart}-${unixCode}`;
    }
});

const User = mongoose.model("User", userSchema);
export default User;