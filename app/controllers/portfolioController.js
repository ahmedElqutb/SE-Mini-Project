var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
mongoose.Promise = require('bluebird');

let Work = require('../models/Work');
let User = require('../models/RegisteredUser');
let Portfolio = require('../models/Portfolio');


let portfolioController = {

	createPortfolio:function(req, res){

		res.render('create-portfolio', {req});

	},

	storePortfolio:function(req, res){

		Portfolio.find({user_id: req.session.user.id}, function(err, portfolio){
            
            if(err){

            	res.redirect('/home');

            }else{

            	if(portfolio.length>0){
            		
            		Work.find(function(err, works){

            			req.session.hasPortfolio = true;
            			req.session.message = 'You already have a portfolio';

                		//res.render('home', {works ,req, message});
        				res.redirect('/home');

        			});
            	
            	}else{

            		if(req.body.title != null && req.body.title != ''){


						if(req.body.picture){
							
							var portfolio = new Portfolio({
		
								name: req.body.name, 
								abstract: req.body.abstract,
								image: {data: fs.readFileSync(req.body.picture), contentType: "image/png"},
								user_id: req.session.user.id
		
							});
						
						}else{

							var portfolio = new Portfolio({
		
								name: req.body.name, 
								abstract: req.body.abstract,
								user_id: req.session.user.id
		
							});

						}

		
						portfolio.save(function(err, portfolio){



		

							var work = new Work({
	
								title: req.body.title, 
								description: req.body.description,
								portfolio_id: portfolio.id
					
							});

							for(var i = 0; i< req.body.pictures.length; i++){

								work.images.push({data: fs.readFileSync(req.body.pictures[i]), contentType: "image/png"});

							}

					
	

							work.save(function(err, work){
								if(err){
								
									res.render('create-portfolio', {err});
								
								}else{

									req.session.hasPortfolio = true;
									req.session.message = 'Created Successfully!';
									res.redirect('/home');
							
								}
							});

							if(err){
								
								res.redirect('/create-portfolio');
							
							}else{

							}
		
			});

		}

            	}
            }
        });

	},

	viewMyPortfolio:function(req, res){


		Portfolio.find({user_id: req.session.user.id}, function(err, portfolios){

			if(portfolios.length>0){


				var portfolio = portfolios[0];
				
				Work.find({portfolio_id: portfolio._id}, function(err, works){
					
					var image;



					var works = works;

					req.session.portfolio_id = portfolio._id;

					console.log(portfolio.image);

					res.render('portfolio', {req, portfolio, works});
					
				});

			}else{

				req.session.message = 'You don\'t have a portfolio created yet';
				res.redirect('/home');

			}		

		});


	},

	viewPortfolio:function(req, res){


		Portfolio.findOne({_id: req.params.id}, function(err, portfolio){

			if(portfolio){

				//var portfolio = portfolios[0];
				
				Work.find({portfolio_id: portfolio._id}, function(err, works){


					var works = works;

					req.session.portfolio_id = portfolio._id;

					//console.log(portfolio.image);

					res.render('portfolio', {portfolio, works});
					
				});

			}else{

				req.session.message = 'Portfolio does not exist';
				res.redirect('/home');

			}		

		});


	},

	editPortfolio:function(req, res){

		Portfolio.find({user_id: req.session.user.id}, function(err, portfolios){

			if(portfolios.length>0){

				var portfolio = portfolios[0];

				res.render('edit-portfolio', {req, portfolio});

			}else{

				req.session.message = 'You don\'t have a portfolio created yet';
				res.redirect('/home');

			}		

		});

		

	},

	updatePortfolio:function(req, res){

		var conditions = {user_id: req.session.user.id};
		var update;
		 if(req.body.picture)
		 	update = {$set: {name: req.body.name, abstract: req.body.abstract, image: {data: fs.readFileSync(req.body.picture), contentType: "image/png"}}};
		else
			update = {$set: {name: req.body.name, abstract: req.body.abstract}};
		
		Portfolio.update(conditions, update, null,
			function(err, portfolio){

				res.redirect('/portfolio');

			});

		

	}


}

module.exports = portfolioController;
