const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        require: true,
    },
    publisher: {
        type: String,
        require: true,
    },
    edition: {
        type: Number,
        require: true,
    },
    pages: {
        type: Number,
        require: false,
    },
    releaseDate: {
        type: Date,
        require: false,
    },
});

bookSchema.index({ name: 1, author: 1, publisher: 1, edition: 1 }, { unique: true });

const model = mongoose.model('Book', bookSchema);
model.createIndexes();

module.exports = model;
