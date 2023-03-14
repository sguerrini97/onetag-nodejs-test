const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const { insertedId } = await req.app.get('database').collection('books').insertOne(req.body);
    return res.send({ id: insertedId });
});

exports = router;
