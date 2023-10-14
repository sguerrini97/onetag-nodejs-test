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

/**
 * Converts a Mongoose Book object to its DTO representation
 * @param {Book} book Mongoose Book object
 * @returns DTO representation of the Book object
 */
bookSchema.statics.toDTO = function (book) {

    const dto = book.toJSON();

    // Remove the time part from the release date, if present
    if (dto.releaseDate) {
        dto.releaseDate = new Date(dto.releaseDate).toISOString().split('T')[0];
    }

    return dto;
};

// Unique index on name, author, publisher and edition to avoid duplicates
bookSchema.index({ name: 1, author: 1, publisher: 1, edition: 1 }, { unique: true });

const model = mongoose.model('Book', bookSchema);
model.createIndexes();

module.exports = model;
