var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({
	name: {type: String, lowercase: true, required: true},
	birthdate: {type: Date, required: true},
	password: {type: String, required: true},
	username: {type: String, required: true, lowercase: true, unique: true}
	/*,
	pic: {type: image}*/

});

UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

module.exports = mongoose.model('User', UserSchema);