var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'thi is forms' });
});


//-START--will list all companies in allcompany_data collection-----------
router.all('/companylist',function(req,res,next){
    var conn_allcompany_data = req.Collection_allcompany;
    conn_allcompany_data.find({},function(err,result){
        if( typeof result == 'undefined' || result.length == 0 ){
            res.json({
                status:0,
                message:'No Result Found'
            });
        }else{
            var data = [];
            for( var k in result ){
                row = {
                    'company' : result[k].get('company'),
                    //'countrycode' : '',
                    'companyid' : result[k].get('companyid'),
                };
                data.push(row);
            }
            res.json(data);
        }
    });
});
//-END---will list all companies in allcompany_data collection-----------

//-START--will list al departparment of companyid-------------------------
router.all('/getdept/:cmp_id',function(req,res,next){
    var conn_allcompany_data = req.Collection_allcompany;
    var company_id = req.params.cmp_id;
    if( typeof company_id == 'undefined' ){
        res.json({
            status: 0,
            message: 'Invalid Request'
        });
    }else{
        var where = {
            'companyid':company_id,
        };
        conn_allcompany_data.find( where, function(err,result){
            if( typeof result == 'undefined' || result.length == 0 ){
                res.json({
                    status:0,
                    message: 'No Result Found',
                });
            }else{
                result = result[0];
                var data = {
                    'company' : result.get('company'),
                    'countrycode' : '',
                    'companyid' : result.get('companyid'),
                };
                
                var e_divisions = result.get('divisions');
                if( typeof e_divisions != 'undefined' ) {
                    var show_divisions = [];
                    for( var k in e_divisions ){
                        a_divid = e_divisions[k].divid;
                        a_dept_name = e_divisions[k].department_name;
                        row = {};
                        row[a_dept_name] = {
                            'divid': a_divid,
                        };
                        
                        show_divisions.push(row);
                    }
                    data['divisions'] = show_divisions;
                }
                
                
                res.json( data );
            }
        });
    }
    
});
//-END---will list al departparment of companyid--------------------------

//-START--will list division of a compnay---------------------------------
router.all('/getdiv/:cmp_id/:div_id',function(req,res,next){
    var conn_allcompany_data = req.Collection_allcompany;
    var company_id = req.params.cmp_id;
    var div_id = req.params.div_id;
    
    if( typeof company_id == 'undefined' || typeof div_id == 'undefined' ){
        res.json({
            status: 0,
            message: 'Invalid Request'
        });
    }else{
        var where = {
            'companyid':company_id,
        };
        conn_allcompany_data.find( where, function(err,result){
            if( typeof result == 'undefined' || result.length == 0 ){
                res.json({
                    status:0,
                    message: 'Company Not Found',
                });
            }else{
                result = result[0];
                var e_divisions = result.get('divisions');
                if( typeof e_divisions == 'undefined'){
                    res.json({
                        status:0,
                        message: 'Divisions Not Found',
                    });
                }else{
                    var match_division = false;
                    
                    for( var k in e_divisions ){
                        a_divid = e_divisions[k].divid;
                        if( a_divid == div_id ){
                            match_division = true;
                            a_dept_name = e_divisions[k].department_name;
                            data = {
                                'Check Balance' :{},
                                'Transfer Money' :{},
                                'Report Suspicious Transactions':{},
                                'Anything Else':{}
                                
                            };
                            data[a_dept_name] = {
                                'tel' : e_divisions[k].tel,
                                'email':e_divisions[k].email,
                                'doitonline':e_divisions[k].doitonline,
                                'callback':e_divisions[k].callback,
                                'chat':e_divisions[k].chat,
                            };
                            res.json( data );
                        }
                    }
                    if( match_division == false){                    
                        res.json({
                            status:0,
                            message: 'Div id Not Found',
                        });
                    }
                }
            }
        });
    }
    
});
//-END_----will list division of a compnay--------------------------------

router.all('/company_details',function(req,res,next){
    var conn_allcompany_data = req.Collection_allcompany;
    //var body = req.param;
    
    console.log('---------------');
    console.log(req.query);
    console.log('---------------');
    
    var company_id = req.query.id;
    var compnay_name = req.query.name;
    
    if( typeof company_id == 'undefined' && typeof compnay_name == 'undefined' ){
        res.json({
            status: 0,
            message: 'Invalid Request'
        });
    }else{
        if( typeof company_id != 'undefined'){
            console.log('11111111111111');
            var where = {
              'companyid':company_id,
            };
        }
        if( typeof compnay_name != 'undefined'){
            console.log('222222222222222');
            var where = {
              'company':compnay_name,
            };
        }
        
        console.log(where);
        
        conn_allcompany_data.find( where, function(err,result){
            if( typeof result == 'undefined' || result.length == 0 ){
                res.json({
                    status:0,
                    message: 'No Result Found',
                });
            }else{
                res.json({
                    status:1,
                    data:result[0],
                });
            }
        });
    }
});

router.all('/free', function (req, res, next) {
    var conn_number_data = req.Collection_number;
    var conn_allcompany_data = req.Collection_allcompany;
    
    var body = req.body;
    
    console.log('-------------------------');
    console.log(body);
    console.log('-------------------------');
    
    
    var f_company_name = body.company_name;
    
    if( typeof f_company_name == 'undefined' ){
        res.json({
            status: 0,
            message: 'Invalid Request'
        });
    }else{
        var f_contact_number = body.contact_number;
        if( typeof f_contact_number == 'undefined' ){   f_contact_number = '';  }
        
        var f_countrycode = body.countrycode;
        if( typeof f_countrycode == 'undefined' ){ f_countrycode = '';    }
    
        var f_email = body.email;
        if( typeof f_email == 'undefined' ){    f_email = '';   }
        
        var f_doitonline = body.doitonline;
        if( typeof f_doitonline == 'undefined' ){   f_doitonline = '';  }
        
        var f_callback = body.callback;
        if( typeof f_callback == 'undefined' ){ f_callback = '';    }
        
        var f_chat = body.chat;
        if( typeof f_chat == 'undefined' ){ f_chat = '';    }
        
        
        var f_data_divisions = body.data_divisions;
        if( typeof f_data_divisions == 'undefined' || f_data_divisions == '' ){
            f_data_divisions = false;
        }
    
        var new_company_id = 101;
    
        var where1 = {
            'company' : f_company_name,
        };
    
        conn_allcompany_data.find( where1, function(err,result){
            if( typeof result == 'undefined' || result.length == 0 ){
                console.log('empty hai !!!');
                var where2= {
                    'type' : 'company_id',
                };
                conn_number_data.find(where2, function (err, result1) {
                    if( typeof result1 == 'undefined' || result1.length == 0 ){
                        var insert__number_data = new conn_number_data({
                            'number' : new_company_id*1,
                            'type' : 'company_id',
                            'last_update':new Date(),
                        });
                        insert__number_data.save(function(err,result){
                            console.log('First insert hua hai!!');
                        });
                    }else{
                        old_company_id = result1[0].get('number');
                        new_company_id = old_company_id + 1;
                        console.log('old -- '+old_company_id);
                        console.log('new -- '+new_company_id);
                        var update1 = {$set: {  number: new_company_id * 1,'last_update':new Date() } };
                        conn_number_data.update(where2,update1,function (err, res) {});
                    }
                    //----------------------------------------------------------------------------------------
                
                    var f_companyid = f_company_name.substr(0,3)+'_'+new_company_id;
                    
                    
                    if( f_data_divisions == false ){
                        console.log('YES YAHAN PAR HAI');
                        var insert__allcompany_data = new conn_allcompany_data({
                            "company":f_company_name,
                            "companyid": f_companyid,
                            "department_name": "departments",
                            "divisions":[{
                                "department_name": "default",
                                "email": f_email,
                                "countrycode": f_countrycode,
                                "divid": 1*1,
                                "tel": f_contact_number*1,
                                "doitonline": f_doitonline,
                                "callback": f_callback,
                                "chat": f_chat,
                                "cobrowse": "",
                                "voice_video": "",
                                "divisions": []
                            }]
                        });
                    }else{
                        console.log('YES YAHAN PAR HAI ---2222222222222222222');
                        var new_divid = 0;
                        for( var k in f_data_divisions){
                            new_divid = new_divid + 1;
                            f_data_divisions[k]['divid'] = new_divid;
                            console.log(' ----- '+new_divid);
                        }

                        
                        var insert__allcompany_data = new conn_allcompany_data({
                            "company":f_company_name,
                            "companyid": f_companyid,
                            "department_name": "departments",
                            "divisions": f_data_divisions,
                        });
                    }
                    
                    insert__allcompany_data.save(function(err, result){
                        console.log('Company Added');
                        res.json({
                            status:1
                        });
                    });                
                });
            }else{
                var existing_divisions = result[0].get('divisions');
                var new_divid = 0;
                for( var k in existing_divisions){
                    old_divid = existing_divisions[k]['divid'];
                    if( old_divid > new_divid ){
                        new_divid = old_divid;
                    }
                }
                console.log(new_divid);
                if( f_data_divisions == false ){
                    new_divid = new_divid + 1;
                    var new_division_data = {
                        "department_name": "default",
                        "email": f_email,
                        "countrycode": f_countrycode,
                        "divid": new_divid,
                        "tel": f_contact_number*1,
                        "doitonline": f_doitonline,
                        "callback": f_callback,
                        "chat": f_chat,
                        "cobrowse": "",
                        "voice_video": "",
                        "divisions": []
                    };
                    existing_divisions.push(new_division_data);
                }else{
                    existing_divisions = [];
                    new_divid = 0;
                    for( var k in f_data_divisions){
                        new_divid = new_divid + 1;
                        a = f_data_divisions[k];
                        a['divid'] = new_divid;
                        
                        console.log(' ----- '+new_divid);
                        
                        existing_divisions.push( a );
                    }
                }

                //console.log(new_divid);
                //console.log(existing_divisions);

                //console.log(new_division_data);
                
                //console.log(existing_divisions);

                var update2 = {$set: {  divisions: existing_divisions } };
                conn_allcompany_data.update(where1,update2,function (err, result) {
                    res.json({
                        status:1
                    });
                });


                console.log('empty nahi hai');
            }
        });
    }
    
});



module.exports = router;
