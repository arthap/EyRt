// MEAN Stack RESTful API Tutorial - Contact List App

var express        =         require("express");
var bodyParser     =         require("body-parser");
var multer = require("multer");
var app            =         express();
var mandrill = require('node-mandrill');

var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//
// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
//var mongojs = require('mongojs');
//var db = mongojs('contactlist', ['contactlist']);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

// app.use(session({ secret: 'session secret key' }));
app.use(flash());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

var mysql      = require('mysql');
var connection = mysql.createConnection({
  // connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'easyTest'
});

//connection.connect();
//connection.query('SELECT * from labels', function(err, rows, fields) {
//  if (!err)
//    console.log('The solution is: ', rows);
//  else
//    console.log('Error while performing Query.');
//});
//
//connection.end();


connection.on('close', function(err) {
  if (err) {
    // Oops! Unexpected closing of connection, lets reconnect back.
    connection = mysql.createConnection(connection.config);
  } else {
    console.log('Connection closed normally.');
  }
});
app.post('/getProductList/:searchingText', function (req, res) {
  // var key = '%'+req.params.searchingText+'%';
  var term=[];
  var sqlLike="";
  term=req.params.searchingText.split(" ");
  for(var i=0;i<term.length;i++){
    term[i];
    console.log(term[i]);
    if(term.length>1){
      var and="and "
      if(term.length-1===i){
        // NAME LIKE '%art%' or DESCRIPTION LIKE '%art%' or SHORT_TEXT LIKE '%art%' and  NAME LIKE '%art%' or DESCRIPTION LIKE '%pro' or SHORT_TEXT LIKE '%product%'

        and="";}
      sqlLike+= "NAME LIKE '%"+term[i]+"%' or DESCRIPTION LIKE '%"+term[i]+"%' or SHORT_TEXT LIKE '%"+term[i]+"%' "+and }
    else{
      sqlLike+= "NAME LIKE '%"+term[i]+"%' or DESCRIPTION LIKE '%"+term[i]+"%' or SHORT_TEXT LIKE '%"+term[i]+"%'"}
  }
  console.log(sqlLike);
  var key =  req.params.searchingText;
  var queryString= "select * from ey_product left join ey_product_resource on ey_product_resource.PRODUCT_ID = ey_product.ID where ("+sqlLike+ ") AND ey_product_resource.`ORDER`=1 LIMIT 10";
  // var queryString = 'SELECT * FROM ey_product WHERE   NAME OR SHORT_TEXT OR DESCRIPTION = ? LIMIT 2';
  console.log(queryString);
  connection.query(queryString,  function(err, product) {
    if (!err){
      console.log('The solution is: ', product);
      res.json(product);
    }


    else
      console.log('Error while performing Query.');
    //connection.release();
    //connection.end();

  });


});

app.post('/GetProductDetailById/:id', function(req, res, next) {



  var key = req.params.id;
  var queryString = 'SELECT * FROM ey_product  WHERE  ID = ?';

  connection.query(queryString,[key],  function(err, productDetail) {
    if (!err){
      console.log('The solution is: ', productDetail);
      res.json(productDetail);
    }


    else
      console.log('Error while performing Query.');
    //connection.release();
    //connection.end();

  });

});


app.post('/GetProductDetailImageById/:id', function(req, res, next) {

  var key = req.params.id;
  var queryString = 'SELECT * FROM ey_product_resource WHERE PRODUCT_ID = ?';

  connection.query(queryString,[key],  function(err, productImages) {
    if (!err){
      console.log('The solution is: ', productImages);
      res.json(productImages);
    }

    else
      console.log('Error while performing Query.');
  });
});
app.post('/contactlist', function (req, res) {
// connection.connect();

  connection.query('INSERT INTO labels (articleNumber,name,size,indicator,color,brand,pricegroup,material,description,image,date,longDescription,kategorie,warehouse ) VALUES(214233320,"hapikt","34","1","red","chanel","A","cotton","fdkhgasldg.NSGV.","/A/A/A/A.PNG","2016","H","londone","aaaaa")', function(err, rows, fields) {
    if (!err)
      console.log('The solution is: ', rows);
    else
      console.log('Error while performing Query.');
  });

  console.log(req.body);
  //connection.end();
  //db.contactlist.insert(req.body, function(err, doc) {
  //  res.json(doc);
  //});
});


// app.post('/fileUpload', function (req, res) {
//
//
//     var updateRecord = 'UPDATE ey_users SET resetPasswordToken = ?  WHERE ID=?';
//     //Update a record.
//     connection.query(updateRecord, [resetPasswordToken,  user[0].ID], function (err, result) {
//         if (err) throw err;
//         else {
//             console.log('Increased the salary for Joe.');
//             // var succes = true;
//
//         }
//     });
//
//     console.log(req.body);
//     //connection.end();
//     //db.contactlist.insert(req.body, function(err, doc) {
//     //  res.json(doc);
//     //});
// });
var fileName;
var storage2 =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/img/uploads');
  },
  filename: function (req, file, callback) {
    fileName='userFoto-' + Date.now()+file.originalname.substring(file.originalname.lastIndexOf("."))
    callback(null, fileName);
  }
});
var upload2 = multer({ storage : storage2}).single('file');

// app.get('/',function(req,res){
//     res.sendFile(__dirname + "/index.html");
// });

app.post('/api/photo',function(req,res){
  upload2(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    var id=req.body.id;
    var imagePath="img/uploads/"+fileName ;
    var updateRecord = 'UPDATE ey_users SET AVATAR = ?  WHERE ID=?';
    connection.query(updateRecord, [imagePath,id  ], function (err, result) {
      if (err) throw err;
      else {
        console.log('Increased the salary for Joe.');
        // var succes = true;

      }
    });

    return  res.json({error_code:0,err_desc:null});
  });
});
var fileName;
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req,  file,cb) {
    cb(null, './uploads/')
  },
  filename: function (req,  file,cb) {
    fileName=file.fieldname + '-' + Date.now()+file.originalname.substring(file.originalname.lastIndexOf("."))
    var datetimestamp = Date.now();
    cb(null,fileName)
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');
app.post('/upload', function(req, res ) {
  upload(req,res,function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    var userId=req.body.userId;
    var name=req.body.name;
    var shortText=req.body.shortText;
    var description=req.body.description;
    var status =req.body.status;
    var createrId=req.body.id;

    var values = ['4','3',req.body.name,req.body.shortText,'1.5',req.body.description,userId,req.body.status,new Date(),new Date()];
    var imagePath="img/uploads/"+fileName ;
    var valuess = ['42',imagePath,'1',fileName.substring(fileName.indexOf(".")+1),new Date(),new Date()];
    connection.query('INSERT INTO ey_product (MANUFACTURER_ID, BRAND_ID,NAME, SHORT_TEXT, CURRENT_SCORE,DESCRIPTION, CREATER_USER_ID, STATUS,CREATED_AT,UPDATED_AT) VALUES(?, ?,?, ?,?,?,?,?,?,?)', values, function(err, result) {


      if (!err) {



        connection.query('INSERT INTO ey_product_resource (PRODUCT_ID, RESOURCE, `ORDER`, RESOURCE_TYPE ,CREATED_AT,UPDATED_AT) VALUES(?,?,?,?,?,?)', valuess, function(err, result) {


          if (!err) {
            console.log('The solution is: ', req.body);
            return  res.json({error_code:0,err_desc:null});



          }
          else
            console.log('Error while performing Query. add error');
          res.json({error_code:1,err_desc:err});
          return;

        });


      }
      // else
      //     console.log('Error while performing Query. add error');
      // res.json({error_code:1,err_desc:err});
      // return;

    });

  })

});

app.post('/addReview/',function(req,res){
  var a={};
  a=req.body;
  var productId=req.body.id;
  var review=a.review;
  var userId=a.userId;
  var like=a.like;
  var disLike=a.disLike;
  var curRate=a.curRate;
  var valuess = [productId,'capch',review,curRate,like,disLike,curRate,userId,'1',new Date(),new Date()];
  connection.query('PRODUCT_ID, REVIEW_CAPTION, REVIEW_TEXT, LIKES_CNT, DISLIKE_CNT, CURRENT_RATE, CREATOR_USER_ID, STATUS, CREATED_AT, UPDATED_AT) VALUES(?,?,?,?,?,?,?,?,?,?)', values, function(err, result) {

    if (err) throw err;
    else {
      return  res.json({error_code:0,err_desc:null});
      console.log('Increased the salary for Joe.');
      // var succes = true;

    }
  });



});
app.post('/api/sendemail/', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      var key = req.body.email;
      var queryString = 'SELECT * FROM ey_users WHERE `E-MAIL` = ?';

      connection.query(queryString, [key], function(err, user) {

        if(user.length===0){
          res.status(500);
          return res.end('E-mail '+ req.body.email+'do not match!');}
        var resetPasswordToken = token;
        var resetPasswordExpires = Date.now() + 3600000; // 1 hour
        var updateRecord = 'UPDATE ey_users SET resetPasswordToken = ?  WHERE ID=?';
        //Update a record.
        connection.query(updateRecord, [resetPasswordToken,  user[0].ID], function (err, result) {
          if (err) throw err;
          else {
            console.log('Increased the salary for Joe.');
            // var succes = true;

          }
        });
        // user.save(function(err) {
        done(err, token, user);
        // });
      });
    },

    function(token, user, done) {
      var options = {
        service: 'Gmail',
        auth: {
          user: 'arthap123@gmail.com',
          pass: 'ganchka123'
        }
      };
      var transporter = nodemailer.createTransport( options);
      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: 'arthap123@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Reset your password',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n' // plaintext body
        // html: '<b>Hello world 🐴 </b>' // html body
      }
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
          // done(err, 'done');
          res.status(200);
          res.end( 'An e-mail has been sent to  '+req.body.email +'   with further instructions.');
          // res.redirect('/#/forgot' );
        }
      })
      // transporter.sendMail(mailOptions, function(err) {
      //     // req.flash('info', 'An e-mail has been sent to ' + 'artiom.sar@gmail.com' + ' with further instructions.');
      //     res.
      //     done(err, 'done');
      // });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

app.get('/reset/:token', function(req, res) {
  // var token=req.params.token;
  var key =  req.params.token;// req.params.token;"art";
  // var key1 =  Date.now()  ;
  var queryString = 'SELECT * FROM ey_users WHERE resetPasswordToken=?  ';
  // var queryString = 'SELECT * FROM ey_users WHERE PASSWORD=? AND USER_TYPE<?';

  connection.query(queryString, [key], function(err, user) {

    if (user.length===0) {
      // req.flash('error', 'Password reset token is invalid or has expired.');
      res.status(400);res.redirect('/#/forgot');

      return res.end('Password reset token is invalid or has expired.');
    }
    // res.end({
    //     user: user[0].AVATAR
    // });
    // res.json(user) ;
    return  res.redirect('/#/reset/'+req.params.token );

  });
});


//////RESET-Password/////
app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      var key = req.params.token;
      // var key1 =   Date.now() + 3600000;
      var queryString = 'SELECT * FROM ey_users WHERE resetPasswordToken=? ';
      var updateRecord = 'UPDATE ey_users SET PASSWORD = ? WHERE ID=?';

      connection.query(queryString, [key], function(err, user) {
        if (user.length===0) {
          var a=1;
          // req.flash('error', 'Password reset token is invalid or has expired.');
          // res.status(400);
          // res.end('Password reset token is invalid or has expired.');
          res.status(500);
          return  res.end( 'You password has expired!');
          // return res.redirect('back');
        }

        var id=user[0].ID
        var password = req.body.PASSWORD;
        var confirm = req.body.CONFIRM_PASSWORD;
        var resetPasswordToken = undefined;
        var resetPasswordExpires = undefined;

        if (password !== confirm){
          res.status(500);
          return res.end('passwords do not match');}
        else {

          //Update a record.
          connection.query(updateRecord, [password, id], function (err, res) {
            if (err) throw err;
            else {
              console.log('Increased the salary for Joe.');
              // var succes = true;
              done(err, user);
            }
          });
          // if(succes)  return res.end('passwords was Update');
        }
      });

    },
    function(user, done) {
      var options = {
        service: 'Gmail',
        auth: {
          user: 'arthap123@gmail.com',
          pass: 'ganchka123'
        }
      };
      var transporter = nodemailer.createTransport( options);
      var mailOptions = {
        from: 'arthap123@gmail.com', // sender address
        to: 'artiom.sar@gmail.com', // list of receivers
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + 'artiom.sar@gmail.com' + ' has just been changed.\n'
      };

      transporter.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
          return res.end('Passwords was Update!');
          done(err);
        }
      })
      // smtpTransport.sendMail(mailOptions, function(err) {
      //     req.flash('success', 'Success! Your password has been changed.');
      //     done(err);
      // });
    }
  ], function(err) {
    res.redirect('/#');
  });
});




app.post('/api/usersCreate', function (req , res) {

  async.waterfall([
    function(done) {
      var email=req.body.E_MAIL;
      var values = [req.body.USERNAME, req.body.PASSWORD, "A",req.body.E_MAIL]

      var queryString = 'SELECT * FROM ey_users WHERE `E-MAIL` = ?';

      connection.query(queryString, [email], function(err, user) {
        if(user.length>0){
          res.status(500);
          return res.end('This email is already registered!');}

        //     connection.query('INSERT INTO labels (articleNumber,name,size,indicator,color,brand,pricegroup,material,description,image,date,longDescription,kategorie,warehouse ) VALUES(214233320,"hapikt","34","1","red","chanel","A","cotton","fdkhgasldg.NSGV.","/A/A/A/A.PNG","2016","H","londone","aaaaa")', function(err, rows, fields) {
//     connection.query("INSERT INTO ey_users  SET ? ",data ,  function(err, rows) {
//     connection.query('INSERT INTO ey_users (  USERNAME, PASSWORD, SOURCE, EULA_ACCEPTED, LAST_LOGIN, USER_TYPE, MANUFACTURER_ID, USER_STATUS,`E-MAIL`,  AVATAR, CURRENT_RATE, CREATED_AT, UPDATED_AT) VALUES ( "kapik","Artyomik", "A", "1", NULL, "1", 4, "1","art@salhd.am", NULL,  NULL, now(), now())',  function(err, rows, fields) {
        connection.query('INSERT INTO ey_users (USERNAME, PASSWORD, SOURCE,`E-MAIL`) VALUES(?, ?, ?,?)', values, function(err, result) {


          if (!err) {
            console.log('The solution is: ', req.body);
            // res.writeHead(200, {"Content-Type": "application/json"});
            // // res.end("{'status:' 200}");
            // var _respond = {
            //     'status': 200
            // };
            res.json("{'status': 200}");

            // res.status(200).json("{'status': 200}");
            // res.writeHead(200, { "Content-Type": "application/json" });
            //  res.end("Adding was  successfully completed");
            done(err,email, result);
          }
          else
            console.log('Error while performing Query. add error');
          // res.writeHead(404, { "Content-Type": "application/json" });
          // res.status(404)
          // json("{'status': 404 }");

        });

      });

    },
    function(email,result, done) {
      var options = {
        service: 'Gmail',
        auth: {
          user: 'arthap123@gmail.com',
          pass: 'ganchka123'
        }
      };
      var transporter = nodemailer.createTransport( options);
      var mailOptions = {
        from: 'arthap123@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Welcome',
        text: 'Hello,\n\n' +
        'Welcom to Easy Rate.\n'
      };

      transporter.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
          return res.end('check yuor e-mail');
          done(err);
        }
      })
      // smtpTransport.sendMail(mailOptions, function(err) {
      //     req.flash('success', 'Success! Your password has been changed.');
      //     done(err);
      // });
    }
  ], function(err) {
    res.redirect('/#');
  });




});
app.delete('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log( req.params.id);
  console.log(id);
  // connection.connect();
  connection.query('DELETE FROM ey_users WHERE id='+id, function(err, rows, fields) {
    if (!err){
      console.log('The solution is: ', rows);
      console.log( req.params.id)}
    else
      console.log('Error while performing Query.');
    //connection.release();
    //connection.end();
  });
  //db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
  //  res.json(doc);
  //});
});
app.post('/userdelete/:user', function (req, res) {
  var user = req.params.user;
  console.log( req.params.user);
  console.log(user);
  // connection.connect();
  connection.query('DELETE FROM ey_users WHERE AVATAR='+user, function(err, rows, fields) {
    if (!err){
      console.log('The solution is: ', rows);
      console.log( req.params.user)}
    else
      console.log('Error while performing Query1!!!.');
  });

});
app.get('/contactlist/:id', function (req, res) {

  var id = req.params.id;
  console.log(id);

  // connection.connect();
  connection.query( 'UPDATE labels SET color="Green" WHERE articleNumber='+id,  function(err, rows, fields) {
    //res.json('.. assume you translated your database response a javascript object yet again .. ')
    //connection.release();
  });
//connection.query('SELECT * from labels where articleNumber='+id, function(err, rows, fields) {
  //      if (!err){
  //         console.log('The solution is: ', rows);
  //         res.json(rows);
  //        }


  //  else
  //       console.log('Error while performing Query.');
  //connection.release();
  //  connection.end();
  // });
////  db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
////    res.json(doc);
////  });
});
app.get('/getDataByEmail/:email', function (req, res) {
  // // connection.connect();
  var key = req.params.email;
  var queryString = 'SELECT * FROM ey_users WHERE `E-MAIL` = ?';

  connection.query(queryString, [key],function(err, rows, fields) {

    // if (err) throw err;
    if (!err){
      res.json(rows);
      for (var i in rows) {
        console.log(rows[i]);
      }}
  });

  // connection.end();
//     var id = req.params.id;
//     console.log(id);
//
//     // connection.connect();
// //
// connection.query('SELECT * FROM ey_users WHERE AVATAR='+id, function(err, rows, fields) {
//     if (err) throw err;
//          if (!err){
//             console.log('The solution2 is: ', rows);
//             res.json(rows);
//              for (var i in rows) {
//                  console.log("2");
//                  console.log(rows[i]);
//              }
//            }
//
//
//      else
//           console.log('Error while performing Query.');
//     // connection.release();
//     //  connection.end();
//     });

});
app.put('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.id);
  // connection.connect();
  connection.query( 'UPDATE labels SET color="Green" WHERE articleNumber='+id,  function(err, rows, fields) {
    //res.json('.. assume you translated your database response a javascript object yet again .. ')
    //connection.release();
  });
  //db.contactlist.findAndModify({
  //  query: {_id: mongojs.ObjectId(id)},
  //  update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
  //  new: true}, function (err, doc) {
  //    res.json(doc);
  //  }
  //);
  //  connection.end();
});

app.listen(3001);
console.log("Server running on port 3001");


//// a GET request = a database READ or (a.k.a SELECT)
//app.get('/path', function(req, res) {
//    connection.query('SELECT * FROM ' + req.params.table + ' ORDER BY id DESC LIMIT 20', req.params.id, function(err, rows, fields) {
//        res.json('.. assume you translated your database response a javascript object .. ')
//        connection.release();
//    });
//});
//
//// a POST request = a database CREATE (a.k.a INSERT)
//app.post('/path', function(req, res) {
//    connection.query('INSERT INTO ' + req.params.table + ' SOME OTHER PARTS OF YOUR SQL QUERY', req.params.id, function(err, rows, fields) {
//        res.json('.. assume you translated your database response a javascript object again .. ')
//        connection.release();
//    });
//});
//
//// a PUT request = a database UPDATE
//app.put('/path', function(req, res) {
//    connection.query('UPDATE ' + req.params.id + ' SOME OTHER PARTS OF YOUR SQL QUERY', req.params.id, function(err, rows, fields) {
//        res.json('.. assume you translated your database response a javascript object yet again .. ')
//        connection.release();
//    });
//});
//
//// a DELETE request = a database DELETE
//app.delete('/path', function(req, res) {
//    connection.query('DELETE FROM ' + req.params.table + ' SOME OTHER PARTS OF YOUR SQL QUERY', req.params.id, function(err, rows, fields) {
//        res.json('.. assume you translated your database response a javascript object once again .. ')
//        connection.release();
//    });
//});
