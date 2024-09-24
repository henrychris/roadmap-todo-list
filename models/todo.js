const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema(
    {
        title: { type: String, required: true },
    },
    { timestamps: true }
);

TodoSchema.virtual("dto").get(function () {
    return {
        id: this._id,
        title: this.title,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
});

module.exports = mongoose.model("Todo", TodoSchema);
