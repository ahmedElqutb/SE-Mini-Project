var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var WorkSchema = new Schema({
	title: {type: String, lowercase: true, required: true},
	description: String,
	link: String,
	portfolio_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true},
	images: [{data: Buffer, contentType: String }]

	/*,
	pic: {type: image}*/

});


module.exports = mongoose.model('Work', WorkSchema);