var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
mongoose.Promise = require('bluebird');
var expressValidator = require('express-validator');

let Work = require('../models/Work');
let User = require('../models/RegisteredUser');
let Portfolio = require('../models/Portfolio');




let userController = {

	welcome:function(req, res){

		res.render('welcome', {req});

	},

	index:function(req, res){

		res.redirect('/home/1');

	},

	register:function(req, res){

		res.render('register');

	},

	login:function(req, res){

		res.render('login');

	},

	home:function(req, res){

		
		Portfolio.count(function(err, c){

			var maxPages = Math.ceil(c/10);

			var page = Math.max(1, req.params.page);


			Portfolio.find(function(err, portfolios){
				
	            
	            if(err){

	                res.send(err.message);
	            
	            }else{
	            	
	            	if(req.session.user){

	            		Portfolio.find({user_id: req.session.user.id}, function(err, portfolio){
	     		   		
	     		   			if(portfolio.length>0)
	     		   				req.session.hasPortfolio = true;
	     		   			else
	     		   				req.session.hasPortfolio = false;


     		   				if(page>maxPages)
     		   					
     		   					res.redirect('/home/'+maxPages);

     		   				else

								res.render('home', {portfolios ,req, page});		     		   		
	     		   			
	     		   	
	     		   	});

	            	}else{

     		   				if(page>maxPages)
     		   					
     		   					res.redirect('/home/'+maxPages);

     		   				else
     		   					
								res.render('home', {portfolios, req, page});

	            	}
	           		
	            }
	        }).skip((page-1)*10).limit(10);
	    });

	},

	search:function(req, res){

		console.log(req.params.keyword);

		res.redirect('/search/'+req.params.keyword+'/1');

	},

	searchPaging:function(req, res){

			var keyword = req.params.keyword;

			console.log(keyword);

		
		Portfolio.count({name: new RegExp(".*" + keyword + ".*")}, function(err, c){

			var maxPages = Math.ceil(c/10);

			var page = Math.max(1, req.params.page);


			Portfolio.find({name: new RegExp(".*" + keyword + ".*")}, function(err, portfolios){
				
	            
	            if(err){

	                res.redirect('/home');
	            
	            }else{
	            	
	            	if(req.session.user){

	            		Portfolio.find({user_id: req.session.user.id}, function(err, portfolio){
	     		   		
	     		   			if(portfolio.length>0)
	     		   				req.session.hasPortfolio = true;
	     		   			else
	     		   				req.session.hasPortfolio = false;


     		   				if(page>maxPages)
     		   					
     		   					res.redirect('/search/'+req.params.keyword+'/'+maxPages);

     		   				else

								res.render('home', {portfolios ,req, page});		     		   		
	     		   			
	     		   	
	     		   	});

	            	}else{

     		   				if(page>maxPages)
     		   					
     		   					res.redirect('/search/'+req.params.keyword+'/'+maxPages);

     		   				else
     		   					
								res.render('home', {portfolios, req, page});

	            	}
	           		
	            }
	        }).skip((page-1)*10).limit(10);
	    });

	},

	editInfo:function(req, res){

		res.render('edit-info', {req});	
		
	}

	,



	createUser:function(req, res){

		req.checkBody('name', 'Name Required').notEmpty();
    	req.checkBody('username', 'Username Required').notEmpty();
    	req.checkBody('birthdate', 'Birthdate Required').isDate(); 
    	req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 20);
	    req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);
	    req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");

	    var errors = req.validationErrors();

    	if(errors){

      		res.render('register', { errors: errors });
    	
    	}else{
		
			var user = new User({
		
				name: req.body.name,
				birthdate: req.body.birthdate,
				password: req.body.password,
		 		username: req.body.username
			
			});

		}
		user.save(function(err){
		
			if(err){
				var message = 'Username already in use!';
				res.render('register', {message});
			}
			else{

				req.session.user = user;
				res.redirect('/home');
			}
		
		});
	
	},


	updateInfo:function(req, res){

		var loginUsername = req.session.user.username;
		var conditions = { username: loginUsername }
		  , update = { $set: {name: req.body.name,
				birthdate: req.body.birthdate,
				username: req.body.username}};

		User.update(conditions, update, null,
			function (err, user){
				Work.update({
					user_username:loginUsername},
					{$set: {user_username: req.body.username}
				}, null, function(err, user){

				});
				if(req.session.user.username != req.body.username){

						req.session.reset();
				
				}
     		   	
     		   	res.redirect('/home');

     		});

	},


	authenticate:function(req, res){

		var loginUsername = req.body.username;
		var currentUser = User.findOne({
			username: loginUsername
		}, function (err, user) {
     		   if (user != null){
     		   		if(bcrypt.compareSync(req.body.password, user.password)){
     		   			req.session.user = user;
     		   			Portfolio.find({user_id: req.session.user.id}, function(err, portfolio){
     		   				req.session.hasPortfolio = true;
     		   				req.session.message = 'login successful';
     		   				res.redirect('/home');
     		   			})
     		   			
     		   		}
     		   		else{
     		   			var message = 'incorrect password';
     		   			res.render('login', {message});
     		   		}	
     		   }
     		   else{
     		   		var message = 'user doesn\'t exist';
     		   		res.render('login', {message});
     		   }
     		   
    	});

		
  		
  		

	},

	checkAuth:function(req, res, next){
		if (!req.user) {
    		res.redirect('/login');
  		} else {
    		next();
  		}
	},

	logout:function(req, res){
  		req.session.reset();
  		res.redirect('/');
	}

    
   
}

module.exports = userController;