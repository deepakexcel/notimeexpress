module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/callcenter');       //comstice

    var conn = mongoose.connection;

    var model_schema = mongoose.Schema({}, {
        strict: false,
        collection: 'register'
    });
    var CollectionModel = conn.model('register', model_schema);

    var model_schema_tree = mongoose.Schema({}, {
        strict: false,
        collection: 'tree_data'
    });
    var CollectionModel_tree = conn.model('tree_data', model_schema_tree);

    var companydetails_dataModel = mongoose.Schema({}, {
        strict: false,
        collection: 'allcompany_data'
    });
    var CollectionModel_allcompany = conn.model('allcompany_data', companydetails_dataModel);

    var number_dataModel = mongoose.Schema({}, {
        strict: false,
        collection: 'number_data'
    });
    var CollectionModel_number = conn.model('number_data', number_dataModel);

    conn.on('error', function (err) {
        console.log(err);
        process.exit();
    });
    return function (req, res, next) {
        req.mongo = conn;
        //req.gfs = gfs;
        req.Collection = CollectionModel;
        req.Collection_tree = CollectionModel_tree;
        req.Collection_allcompany = CollectionModel_allcompany;
        req.Collection_number = CollectionModel_number;
        next();
    };

};
