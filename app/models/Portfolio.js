var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PortfolioSchema = new Schema({
	name: {type: String, lowercase: true, required: true},
	abstract: String,
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	image: {data: Buffer, contentType: String }

	/*,
	pic: {type: image}*/

});


module.exports = mongoose.model('Portfolio', PortfolioSchema);