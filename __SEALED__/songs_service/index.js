const express = require('express');
const {decypher} = require('../crypto');
const songs = require('./songs');

function authenticate() {
    return function(req, res, next) {
        if (req.header('TOKEN-V1') === null) {
            return res.status(403).send({
                error: 'TOKEN-V1 http header missing',
            });
        }
        let token;
        try {
            token = decypher(req.header('TOKEN-V1'));
        } catch (error) {
            return res.status(401).send({
                error: 'TOKEN-V1 http header invalid',
            });
        }
        const ttl = Number(token);
        if (isNaN(ttl)) {
            return res.status(401).send({
                error: 'TOKEN-V1 http header invalid',
            });
        }
        if (Date.now() > ttl) {
            return res.status(403).send({
                error: 'TOKEN-V1 expired',
            });
        }
        return next();
    };
}

(async () => {
    try {
        const app = express();
        const count = 1800;
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.get('/count', authenticate(), (req, res) => res.send({ count }));
        app.get('/', authenticate(), (req, res) => {
            if (req.query.offset == null || isNaN(Number(req.query.offset))) {
                return res.status(401).send({
                    error: '"offset" query parameter missing or not a number',
                });
            }
            if (req.query.limit == null || isNaN(Number(req.query.limit))) {
                return res.status(401).send({
                    error: '"limit" query parameter missing or not a number',
                });
            }
            const offset = Number(req.query.offset);
            const limit = Number(req.query.limit);
            if (limit > 500) {
                return res.status(401).send({
                    error: '"limit" query parameter must be lower than 500',
                });
            }
            return res
                .status(200)
                .send(songs.get(offset, offset + limit));
        });
        app.listen(process.env.SONGS_PORT, () => {
            console.log(`Listening on http://localhost:${process.env.SONGS_PORT}`);
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
