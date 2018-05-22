const mongoose = require("mongoose");
var EditSchema = mongoose.Schema({
    content: {type: String, default: ""}
}, {timestamps: true});
mongoose.model("Edit", EditSchema);