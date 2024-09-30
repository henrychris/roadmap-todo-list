import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
    },
    {
        timestamps: true, // auto add createdAt and updatedAt
        virtuals: {
            dto: {
                get() {
                    return {
                        id: this._id,
                        name: this.name,
                        email: this.email,
                    };
                },
            },
        },
    }
);

export const User = mongoose.model("User", UserSchema);
