const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true } // auto add createdAt and updatedAt
);

UserSchema.virtual("dto").get(function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
});

module.exports = mongoose.model("User", UserSchema);
