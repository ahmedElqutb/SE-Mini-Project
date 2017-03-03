var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
mongoose.Promise = require('bluebird');

let Work = require('../models/Work');
let User = require('../models/RegisteredUser');
let Portfolio = require('../models/Portfolio');


let workController = {


	addWork:function(req, res){

		res.render('add-work', {req});

	},

	storeWork:function(req, res){

		var work = new Work({
		
				title: req.body.title, 
				description: req.body.description,
				portfolio_id: req.session.portfolio_id

			});	



		if(req.body.pictures){

			work.images.push({data: fs.readFileSync(req.body.pictures), contentType: "image/png"});


		}

		work.save(function(err, work){
			if(err){
			
				res.render('add-work', {err});
			
			}else{
				req.session.message = 'Created Successfully!';
				res.redirect('/home');
		
			}
		});

	},

	removeWork:function(req, res){


		Portfolio.findOne({user_id: req.session.user.id}, function(err, portfolio){
			
			Work.remove({_id: req.params.id, portfolio_id: portfolio.id}, function(err){
				
				if(err){

					res.redirect('/home');

				}else{

					res.redirect('/portfolio');

				}

			});			

		})

	},

	editWork:function(req, res){

		Portfolio.findOne({user_id: req.session.user.id}, function(err, portfolio){

			Work.findOne({_id: req.params.id}, function(err, work){

				if(err){

					res.redirect('/home');

				}else{

					if(work.portfolio_id == portfolio.id){

							var currentWork = work;
							res.render('edit-works', {req, currentWork});

					}else{

						req.session.message = 'Cannot modify material owned by another user';
						res.redirect('/home');

					}

				}

			})			

		});

	},

	updateWork:function(req, res){

		var conditions = {_id: req.params.id};
		var update = {$set: {title: req.body.title, description: req.body.description, link: req.body.link}};


		Work.update(conditions, update, null, function(err){
			if(err){

				res.redirect('/home');
				
			}else{
				
			}
		
		});

		Work.findById(req.params.id, function (err, work){
 		

			if(req.body.pictures){

				//console.log(req.body.pictures.length);

					work.images.push({data: fs.readFileSync(req.body.pictures), contentType: "image/png"});


			}
  					
  			work.save(function(err, work){

				res.redirect('/portfolio');
  					
 			});

		});

	},

	viewWork:function(req, res){

		Work.findOne({_id: req.params.id}, function(err, work){

			if(err){

				res.redirect('/home');

			}else{

				res.render('work', {req,work});

			}

		})

	},

	removeImage:function(req, res){

		Work.update( 
      		{ _id: req.params.id1 },
      		{ $pull: { images : { _id : req.params.id2 } } },
      		{ safe: true },
      		function (err, work){
       			
      			res.redirect('/works/'+req.params.id1);

      	});


	},

	addImage:function(req, res){



	}


}

module.exports = workController;
