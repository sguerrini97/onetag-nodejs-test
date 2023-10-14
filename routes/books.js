const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Book = require('../models/Book');

mongoose.connect(`mongodb://database:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error(error);
});

router.post('/', [
    body('name').notEmpty(),
    body('author').notEmpty(),
    body('publisher').notEmpty(),
    body('edition').isInt({ min: 1 }),
    body('pages').optional().isInt({ min: 1 }),
    body('releaseDate').optional().isDate(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        res.status(422).json({ errors: errors.array() });

    } else {

        // Store book data in MongoDB and return the new book ID
        const book = new Book(req.body);

        try {
            
            await book.validate();
            const result = await book.save();

            res.status(200).json({id: result._id});

        } catch (error) {
            switch (error.code) {
                case 11000:
                    res.status(409).json();
                    break;
                default:
                    console.log(error);
                    res.status(500).json(error);
                    break;
            }
        }
    }
});

router.get('/:id', [
    param('id').isMongoId()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        res.status(400).json({ errors: errors.array() });

    } else {

        const bookId = req.params.id;

        // Retrieve book data from MongoDB
        const book = await Book.findById(bookId).select('-_id -__v');

        if (!book) {
            res.status(404).json();
        } else {
            res.status(200).json(book);
        }
    }

});

module.exports = router;
