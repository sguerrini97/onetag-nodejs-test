const express = require('express');
const {faker} = require('@faker-js/faker');
const {decypher} = require('../crypto');

(async () => {
    try {
        const port = 9009;
        const app = express();
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.get('/', (req, res) => {
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
            if (ttl >= Date.now()) {
                return res.status(403).send({
                    error: 'TOKEN-V1 expired',
                });
            }
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
            const items = [];
            faker.seed(0);
            for (let i = 0; i < 1800; i++) {
                items.push({
                    id: i,
                    name: faker.music.songName(),
                    author: faker.name.fullName(),
                    genre: faker.music.genre(),
                    description: faker.lorem.text(),
                })
            }
            return res
                .status(200)
                .send(items.slice(offset, offset + limit));
        });
        app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}`);
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
