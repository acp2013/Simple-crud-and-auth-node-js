var express = require('express');
var router = express.Router();
var Buku = require('./models/buku');
var multer  =   require('multer');
var img ="";
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
	img = Date.now()+'_'+ file.originalname;
    callback(null, img);
  }
});
var upload = multer({ storage : storage}).single('file');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page---------------------------------- */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST-------------------------------------- */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page ------------------------------------------------*/
	router.get('/home', isAuthenticated, function(req, res){
		var response = {};
        Buku.find({},function(err,data){
			if(err) {
                response = {"error1" : true,"message" : "Error fetching data"};
            } else {
				res.render('home', { user: req.user, data:data});
      
            }
           // res.json(response);
		 });
		
	});
	
	/* Handle Insert ------------------------------------------------*/
	
	router.post('/home', function(req, res) {
		//var gambar="";
		upload(req,res,function(err) {
			if(err) {
				return res.end("Error uploading file.");
			}			
			var db = new Buku();
			
			var response = {};
			db.judul = req.body.judul; 
			db.gambar =  "/images/"+img;
			db.pengarang = req.body.pengarang; 
			db.tahun = req.body.tahun; 
			db.save(function(err){
			if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                res.redirect('/home');
            }
            res.json(response);
			});
			//res.end(req.file.originalname+"File is uploaded");
		});  
		
	});
	
	/* Handle Delete ------------------------------------------------*/
	
	router.get('/delete/:id', function(req, res) {
        var response = {};
        // find the data
        Buku.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                Buku.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.redirect('/home');
                });
            }
        });
	});
	
	//Handle edit -------------------------------------------
	
	router.get('/edit/:id',isAuthenticated, function(req, res) {
        var response = {};
        Buku.findById(req.params.id,function(err,data){
			if(err) {
                response = {"error1" : true,"message" : "Error fetching data"};
            } else {
				res.render('edit', { user: req.user, data:data});
      
            }
           // res.json(response);
		 });
	});
	
	router.post('/home/edit/:id', function(req, res) {
		
		var response = {};
        Buku.findById(req.params.id,function(err,data){			
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {					
				upload(req,res,function(err) {
					if(err) {						
						return res.end("Error uploading file.");
					}						
					data.judul = req.body.judul;
					data.pengarang = req.body.pengarang;
					data.tahun = req.body.tahun; 
					console.log("cok__"+req.body.file)
					if(req.file != undefined) {                   
						data.gambar =  "/images/"+img;
					}			
					data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        res.redirect('/home');
                    }
                    res.json(response);
					});
					
                })
            }            
               
        });
	});
	
		
	/* Handle Logout----------------------------- */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	router.get('/insert',isAuthenticated, function(req, res){
		res.render('insert',{user: req.user});
	});
	
	router.get('/edit',isAuthenticated, function(req, res){
		res.render('insert',{user: req.user});
	});
	
                                                                                            

	return router;
}





