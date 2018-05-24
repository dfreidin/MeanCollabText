const edits = require("../controllers/edits");
module.exports = function(app) {
    app.post("/api/new", edits.create);
    app.get("/api/rejoin", edits.rejoin);
    app.get("/api/check/:id", edits.check);
};