import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TodoSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
        virtuals: {
            dto: {
                get() {
                    return {
                        id: this._id,
                        title: this.title,
                        description: this.description,
                    };
                },
            },
        },
    }
);

export const Todo = mongoose.model("Todo", TodoSchema);
