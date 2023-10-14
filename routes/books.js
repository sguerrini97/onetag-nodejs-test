const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { MongoClient, ObjectId } = require('mongodb');

const mongoClient = new MongoClient(`mongodb://database:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`);
mongoClient.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error(error);
});

const booksCollection = mongoClient.db().collection('books');

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
        const mongoResult = await booksCollection.insertOne(req.body);
        res.status(200).json({id: mongoResult.insertedId});
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
        const mongoResult = await booksCollection.findOne({
            _id: new ObjectId(bookId)
        });

        if (!mongoResult) {
            res.status(404).json();
        } else {
            delete mongoResult._id;
            res.status(200).json(mongoResult);
        }
    }

});

module.exports = router;
