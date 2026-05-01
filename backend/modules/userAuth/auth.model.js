import mongoose from "mongoose";

const { Schema } = mongoose;

// Sub-schema for Addresses
const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  pin_code: Number,
  isDefault: { type: Boolean, default: false },
});

// Sub-schema for Orders (Reference or Embedded)
const orderSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    status: { type: String, default: "Pending" },
    totalAmount: Number,
  },
  { timestamps: true },
);

//Role enum for better type safety
const userRoles = {
  BUYER: "buyer",
  ADMIN: "admin",
  SUPER_ADMIN: "superAdmin",
};

const userSchema = new Schema(
  {
    userId: { type: String, unique: true }, // Custom ID: Mobile + Unix
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      default: null,
    },
    mobile: { type: String, unique: true, sparse: true, default: null },
    password: { type: String, required: true, select: false }, // select: false to exclude from queries by default

    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.BUYER, // Default role is buyer
    },
    // Arrays for nested data
    addresses: [addressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orders: [orderSchema],

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
); // This adds createdAt and updatedAt automatically

userSchema.pre("save", function () {
  if (!this.userId) {
    const time = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    const mobilePart = this.mobile ? this.mobile.slice(-4) : "0000";
    this.userId = `USR-${mobilePart}-${time}-${random}`;
  }
});

const User = mongoose.model("User", userSchema);
export { User, userRoles };
export default User;
