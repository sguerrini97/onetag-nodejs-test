const express = require('express');
const router = express.Router();

const { body, param, validationResult } = require('express-validator');

router.post('/', [
    body('name').notEmpty(),
    body('author').notEmpty(),
    body('publisher').notEmpty(),
    body('edition').isInt({ min: 1 }),
    body('pages').optional().isInt({ min: 1 }),
    body('releaseDate').optional().isDate(),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        res.status(422).json({ errors: errors.array() });

    } else {

        // Store book data
        res.status(501).json({ message: 'Passed validation' });

    }
});

router.get('/:id', [
    param('id').isUUID()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        res.status(400).json({ errors: errors.array() });

    } else {

        const bookId = req.params.id;

        // Retrieve book data
        res.status(501).json({ message: `Looking for book ${bookId}` });

    }

});

module.exports = router;
