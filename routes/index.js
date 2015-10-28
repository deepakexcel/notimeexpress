var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
/* GET home page. */
router.all('/add', function (req, res) {
    var database = req.Collection;
    var all_info = req.body.data;
    var firstname = all_info.firstname;
    var surname = all_info.surname;
    var com_name = all_info.companyname;
    var email = all_info.email;
    var telephone = all_info.telephone;
    var country = all_info.country;
    var com_web_address = all_info.web_address;
    var departments = all_info.departments;
    var postion = all_info.position;
    var vendor = all_info.vendor;
    var configured_agents = all_info.configured_agents;
    var mgmt_service = all_info.mgmt_service;
    var chat_service = all_info.chat_service;
    var country_no = all_info.country_number;
    var industry = all_info.industry;
    var register = all_info.register;
    var terms_condition = all_info.terms_condition;
    if (firstname && surname) {
        var info = new database({
            firstname: firstname,
            surname: surname,
            company_name: com_name,
            email: email,
            telephone: telephone,
            country: country,
            com_web_address: com_web_address,
            departments: departments,
            postion: postion,
            vendor: vendor,
            configured_agents: configured_agents,
            mgmt_service: mgmt_service,
            chat_service: chat_service,
            country_no: country_no,
            industry: industry,
            register: register,
            terms_condition: terms_condition
        });
        info.save(function (err) {
            if (err) {
                console.log(err);
                res.json({status: 0, msg: err});
            }
            else {
                res.json({status: 1, msg: 'Info Saved'});
            }
        });
    }
    else {
        res.json({status: 0, msg: 'Invalid Request'});
    }
});
//router.all('/addtree', function (req, res) {
//
//    var database = req.Collection_tree;
//    var all_info = req.body.data;
//    var id = '560ccc97c5a05d7e2d073ccc';
//    if (id && all_info) {
//        database.update({
//            '_id': mongoose.Types.ObjectId(id)
//        }, {
//            $set: {
//                info: all_info
//            }
//        }, function (err) {
//            if (err) {
//                console.log(err);
//                res.json({status: 0, err: err});
//            } else {
//                res.json({status: 1});
//            }
//        });
//    }
//    else {
//        res.json({status: 0, err: 'Invalid Request'});
//    }
//});

router.all('/addtree', function (req, res) {
    var database = req.Collection_tree;
    var all_info = req.body.data;
//    console.log('All_info' + JSON.stringify(all_info));
    database.find({
    }, function (err, result) {
        if (err) {
//            console.log(err);
            res.json({status: 0, err: err});
        }
        else if (!result || result.length == 0) {
            console.log('empty');
            var post = new database({
                info: all_info
            });
            post.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json({status: 0, msg: err});
                } else {
                    res.json({status: 1, msg: 'information saved'});
                }
            });
        }
        else {
            console.log('record more than 1');
            //            for (var i = 0; i < result.length; i++) {
            var row = result[0];
            var id = row.get('_id');
            database.update({
                '_id': mongoose.Types.ObjectId(id)
            }, {
                $set: {
                    info: all_info
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                    res.json({status: 0, err: err});
                } else {
                    console.log('information updated');
                    res.json({status: 1, msg: 'information saved', info: all_info});
                }
            });
//            }
        }
    });
});

router.all('/showalltree', function (req, res) {
    var database = req.Collection_allcompany;
//    var reasonCode = req.query.reasonCode;
//    var description = req.query.password;
    var info = [];
    database.find({
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                var department_name = row.get('department_name');
                var div = row.get('divisions');
                info.push({department_name: department_name, divisions: div});
            }
            res.json(info);
        }
    });
});

//Code for saving details of company with their contact number for Option1_Free
router.all('/company/add', function (req, res) {
    var database_companydetails = req.Collection_allcompany;
    var database_number = req.Collection_number;
    var company = req.body.company_name;
    var company_subname = req.body.company_subname;
    var number = '101';
    if (company) {
        database_number.find({
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result || result.length == 0) {
                var new_post = new database_number({
                    number: number
                });
                new_post.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (company) {
                            database_companydetails.find({
                                company: company
                            }, function (err1, result1) {
                                if (err1) {
                                    console.log(err1);
                                }
                                if (!result1 || result1.length == 0) {
                                    var new_post = new database_companydetails({
                                        company: company,
                                        companyid: company_subname + '_' + number
                                    });
                                    new_post.save(function (err1) {
                                        if (err1) {
                                            console.log(err1);
                                        }
                                        else {
                                            res.json({status: 1, msg: 'information stored', company_id: company_subname + '_' + number});
                                        }
                                    });
                                } else {
                                    var res_id = result1[0].get('companyid');
                                    res.json({status: 1, company_id: res_id});
                                }
                            });
                        }
                    }
                });
            } else {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    var number_old = row.get('number');
                }
                var number_new = parseInt(number_old) + 1;
                if (company) {
                    database_companydetails.find({
                        company: company
                    }, function (err1, result1) {
                        if (err1) {
                            console.log(err1);
                        }
                        if (!result1 || result1.length == 0) {
                            var new_post = new database_companydetails({
                                company: company,
                                companyid: company_subname + '_' + number_new
                            });
                            new_post.save(function (err1) {
                                if (err1) {
                                    console.log(err1);
                                }
                                else {
                                    database_number.find({
                                    }, function (err, docs) {
                                        if (!err) {
                                            if (docs.length > 0) {
                                                var row = docs[0];
                                                database_number.update({
                                                    '_id': row.get('_id')
                                                }, {
                                                    $set: {
                                                        number: number_new
                                                    }
                                                }, function (err) {
                                                    if (!err) {
                                                        console.log('Update Done');
//                                                        res.json({status: 1, msg: 'information stored and number updated'});
                                                    }
                                                    else {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                });
                                            }
                                            else {
                                                console.log('Not Found');
                                            }
                                        }
                                    });
                                    res.json({status: 1, msg: 'all data saved', company_id: company_subname + '_' + number_new});
                                }
                            });
                        }
                        else {
                            var res_id = result1[0].get('companyid');
                            res.json({status: 1, company_id: res_id});
                        }
                    });
                }
                else {
                    res.json({status: 0, msg: 'Invalid Request'});
                }
            }
        });
    }
    else {
        res.json({status: 0, msg: 'Invalid Request'});
    }
});

//Code of adding divisions in mongoDB
router.all('/company/add/division', function (req, res) {
    var database_companydetails = req.Collection_allcompany;
    var companyid = req.body.companyid;
    var department = req.body.dept_name;
    var countrycode = req.body.countrycode;
    var telephone = req.body.number;
    var email = req.body.email;
    var doitonline = req.body.doitonline;
    var callback = req.body.callback;
    var chat = req.body.chat;
    var cobrowse = req.body.cobrowse;
    var voice_video = req.body.voice_video;
    var res_div_id;

    if (!department) {
        department = 'default';
    }
    if (companyid && department) {
        database_companydetails.find({
            companyid: companyid
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else if (!result || result.length == 0) {
                res.json({status: 0, msg: 'Record not found'});
            } else {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    var company_id = row.get('companyid');
                    var divisions = row.get('divisions');
                    var company_name = row.get('company');
                }
                if (divisions) {
                    var division = [];
                    for (var b = 0; b < divisions.length; b++) {
                        division.push(divisions[b]);
                    }
                    if (division[0].length) {
                        var new_record = {"department_name": department, "email": email, "countrycode": countrycode,
                            "divid": division[0].length + 1, "tel": telephone, "doitonline": doitonline,
                            "callback": callback, "chat": chat, "cobrowse": cobrowse, "voice_video": voice_video, divisions: []};
                        res_div_id = division[0].length + 1;
                    }
                    else {
                        new_record = {"department_name": department, "email": email, "countrycode": countrycode,
                            "divid": division.length + 1, "tel": telephone, "doitonline": doitonline,
                            "callback": callback, "chat": chat, "cobrowse": cobrowse, "voice_video": voice_video, divisions: []};
                        res_div_id = division.length + 1;
                    }
                    division.push(new_record);
                    var div = JSON.stringify(division);
                    var div_new = JSON.parse(div);
                }
                else {
                    var div_new = [];
                    new_record = {"department_name": department, "email": email, "countrycode": countrycode,
                        "divid": 1, "tel": telephone, "doitonline": doitonline,
                        "callback": callback, "chat": chat, "cobrowse": cobrowse, "voice_video": voice_video, divisions: []};
                    res_div_id = 1;
                    div_new.push(new_record);
                }
                database_companydetails.find({
                    "companyid": companyid
                }, function (err, docs) {
                    if (!err) {
                        if (docs.length > 0) {
                            var row = docs[0];
                            database_companydetails.update({
                                'companyid': row.get('companyid')
                            }, {
                                $set: {
                                    company: company_name,
                                    companyid: company_id,
                                    department_name: 'departments',
                                    divisions: div_new
                                }
                            }, function (err) {
                                if (!err) {
                                    res.json({status: 1, divid: res_div_id});
                                }
                            });
                        }
                        else {
                            console.log('Not Found');
                            res.json({status: 0, mgs: 'Not Found'});
                        }
                    }
                });
            }
        });
    }
    else {
        res.json({status: 0, msg: 'Invalid Request'});
    }
});

router.all('/company/alldetails', function (req, res) {
    var database = req.Collection_allcompany;
    var companyid, company, countrycode, contact_number, info = [];
    var info = [];
    database.find({
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                companyid = row.get('companyid');
                company = row.get('company');
//                contact_number = row.get('contact_number');
//                countrycode = row.get('countrycode');
//                info.push({companyid: companyid, company: company, countrycode: countrycode, contact_number: contact_number});
                info.push({companyid: companyid, company: company});
            }
            res.json(info);
        }
    });
});
router.all('/company/delete', function (req, res) {
    var database = req.Collection_allcompany;
    var companyid = req.body.delete_id;
    if (companyid) {
        database.find({
            companyid: companyid
        }, function (error, result) {
            if (error) {
                console.log(error);
            }
            if (!result || result.length == 0) {
                res.json({status: 0, msg: 'Record is not Exist.'});
            } else {
                database.remove({
                    companyid: companyid
                }, function (err) {
                    if (err) {
                        console.log(err);
                        res.json({status: 0, err: err});
                    }
                    else {
                        res.json({status: 1, msg: 'Record Deleted'});
                    }
                });
            }
        });
    }
});

//API for updating information
router.all('/company/update', function (req, res) {
    var database = req.Collection_allcompany;
    var edit_value = req.body.update_id;
    var company = req.body.company;
//    var countrycode = req.body.countrycode;
//    var contact_number = req.body.contact_number;
    if (edit_value) {
        database.find({
            companyid: edit_value
        }, function (err, docs) {
            if (!err) {
                if (docs.length > 0) {
                    var row = docs[0];
                    var div = row.get('divisions');
                    database.update({
                        companyid: row.get('companyid')
                    }, {
                        $set: {
                            company: company,
                            divisions: div
//                            countrycode: countrycode,
//                            contact_number: contact_number,
//                            "divisions": {
////                                "default": {
//                                "department_name": "default",
//                                "divid": "1",
//                                "contact_number": contact_number
////                            }
//                            }
                        }
                    }, function (err) {
                        if (!err) {
                            res.json({status: 1, msg: 'Record Updated'});
                        }
                    });
                }
                else {
                    res.json({status: 0, msg: 'Record not Found'});
                }
            }
        });
    }
});

router.all('/company/list', function (req, res) {
    var database = req.Collection_allcompany;
    var companyid, company, countrycode, info = [];
    var info = [];
    database.find({
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                companyid = row.get('companyid');
                company = row.get('company');
                countrycode = row.get('countrycode');
                info.push({company: company, countrycode: countrycode, companyid: companyid});
            }
            res.json(info);
        }
    });
});

//Showing every informatiion of all companies
router.all('/company/listall', function (req, res) {
    var database = req.Collection_allcompany;
    var companyid, company, countrycode, divisions, info = [];
    var info = [];
    database.find({
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                companyid = row.get('companyid');
                company = row.get('company');
                countrycode = row.get('countrycode');
                divisions = row.get('divisions');
                info.push({company: company, countrycode: countrycode, companyid: companyid, divisions: divisions});
            }
            res.json(info);
        }
    });
});

//Showing every informatiion of given companies
router.all('/getdept', function (req, res) {
    var database = req.Collection_allcompany;
    var company_id = req.body.company_id;
    var companyid, company, countrycode, divisions, info = [];
    var info = [];
    database.find({
        companyid: company_id
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                companyid = row.get('companyid');
                company = row.get('company');
                countrycode = row.get('countrycode');
                divisions = row.get('divisions');
                info.push({company: company, countrycode: countrycode, companyid: companyid, divisions: divisions});
            }
            res.json(info);
        }
    });
});


//Showing division informatiion of given companies
router.all('/getdiv', function (req, res) {
    var database = req.Collection_allcompany;
    var company_id = req.body.company_id;

    var companyid, company, countrycode, divisions, info = [];
    var info = [];
    database.find({
        companyid: company_id
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                companyid = row.get('companyid');
                company = row.get('company');
                countrycode = row.get('countrycode');
                divisions = row.get('divisions');
                info.push({divisions: divisions});
            }
            res.json(info);
        }
    });
});

//Showing every informatiion of given companies using Get Request
router.get('/getdept/:companyid', function (req, res) {
    var database = req.Collection_allcompany;
    var company_id = req.params.companyid;
    var companyid, company, countrycode, divisions, info = [];
    var info = [];
//    res.send('user ' + req.params.companyid);
    database.find({
        companyid: company_id
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                companyid = row.get('companyid');
                company = row.get('company');
                countrycode = row.get('countrycode');
                divisions = row.get('divisions');
                info.push({company: company, countrycode: countrycode, companyid: companyid, divisions: divisions});
            }
            res.json(info);
        }
    });
});

//Showing division informatiion of given companies using get
router.get('/getdiv/:companyid', function (req, res) {
    var database = req.Collection_allcompany;
//    var company_id = req.body.company_id;
    var company_id = req.params.companyid;
    var companyid, company, countrycode, divisions, info = [];
    var info = [];
    database.find({
        companyid: company_id
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({status: 0, err: err});
        }
        else {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                companyid = row.get('companyid');
                company = row.get('company');
                countrycode = row.get('countrycode');
                divisions = row.get('divisions');
                info.push({divisions: divisions});
            }
            res.json(info);
        }
    });
});

//Code of adding divisions in mongoDB for only Full_Package
router.all('/company/add/division_fullpackage', function (req, res) {
    var database_companydetails = req.Collection_allcompany;
    var companyid = req.body.companyid;
    var data = req.body.data;
    var department = req.body.dept_name;
    var res_div_id = 1;

    if (!department) {
        department = 'default';
    }
    if (companyid && department) {
        database_companydetails.find({
            companyid: companyid
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else if (!result || result.length == 0) {
                res.json({status: 0, msg: 'Record not found'});
            } else {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    var company_id = row.get('companyid');
                    var company_name = row.get('company');
                }
//                if (divisions) {
//                    var tempData = divisions;
////                    var division = [];
////                    if (tempData.length > 1) {
////                        for (var v = 0; v < tempData.length; v++) {
////                            division.push(tempData[v]);
////                        }
////                    }
////                    else {
////                        division.push(tempData);
////                    }
////                    if (division[0].length) {
////                        var new_record = {"department_name": department, "email": email, "countrycode": countrycode,
////                            "divid": division[0].length + 1, "tel": telephone, "doitonline": doitonline,
////                            "callback": callback, "chat": chat, "cobrowse": cobrowse, "voice_video": voice_video, divisions: []};
////                        res_div_id = division[0].length + 1;
////                    }
////                    else {
////                        new_record = {"department_name": department, "email": email, "countrycode": countrycode,
////                            "divid": division.length + 1, "tel": telephone, "doitonline": doitonline,
////                            "callback": callback, "chat": chat, "cobrowse": cobrowse, "voice_video": voice_video, divisions: []};
////                        res_div_id = division.length + 1;
////                    }
////                    division.push(new_record);
////                    var div = JSON.stringify(division);
////                    var div_new = JSON.parse(div);
//                }
//                else {
//                    var new_record = data;
//                    res_div_id = 1;
//                    var div_new = new_record;
//                }
                database_companydetails.find({
                    "companyid": companyid
                }, function (err, docs) {
                    if (!err) {
                        if (docs.length > 0) {
                            var row = docs[0];
                            database_companydetails.update({
                                'companyid': row.get('companyid')
                            }, {
                                $set: {
                                    company: company_name,
                                    companyid: company_id,
                                    department_name: 'Departments',
                                    divisions: data
                                }
                            }, function (err) {
                                if (!err) {
                                    res.json({status: 1, divid: res_div_id});
                                }
                            });
                        }
                        else {
                            console.log('Not Found');
                            res.json({status: 0, mgs: 'Not Found'});
                        }
                    }
                });
            }
        });
    }
    else {
        res.json({status: 0, msg: 'Invalid Request'});
    }
});
module.exports = router;
