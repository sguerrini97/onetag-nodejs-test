const express = require('express');
const {cypher} = require('../crypto');

(async () => {
    try {
        const app = express();
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.get('/access-token', (req, res) => {
            const ttl = Date.now() + (1000 * 60 * 60);
            res.send({ 'TOKEN-V1': cypher(String(ttl)) });
        });
        app.listen(process.env.AUTH_PORT, () => {
            console.log(`Listening on http://localhost:${process.env.AUTH_PORT}`);
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
