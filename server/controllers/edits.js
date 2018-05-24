const mongoose = require("mongoose");
const Edit = mongoose.model("Edit");
function buildQueryHandler(res) {
    return function(err, data) {
        if(err) {
            res.json({
                message: "Error",
                error: err
            });
        }
        else {
            res.json({
                message: "Success",
                data: data
            });
        }
    };
}
module.exports = {
    create: function(req, res) {
        Edit.create({content: ""}, buildQueryHandler(res));
    },
    rejoin: function(req, res) {
        if(req.session["db_id"]) {
            Edit.findById(req.session.db_id, buildQueryHandler(res));
        }
        else {
            res.json({
                message: "Error",
                error: "No recent session"
            });
        }
    },
    check: function(req, res) {
        Edit.findById(req.params.id, buildQueryHandler(res));
    }
}