var mongoose = require('mongoose');

module.exports = mongoose.model('Buku',{
	id: String,
	judul: String,
	gambar: String,
	pengarang: String,
	tahun: String
});