const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

TodoSchema.virtual("dto").get(function () {
    return {
        id: this._id,
        title: this.title,
        description: this.description,
    };
});

module.exports = mongoose.model("Todo", TodoSchema);
