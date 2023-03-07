const express = require('express');
const {cypher} = require('../crypto');

(async () => {
    try {
        const port = 9010;
        const app = express();
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.get('/access-token', (req, res) => {
            const ttl = Date.now() + (1000 * 60 * 60);
            res.send({ 'TOKEN-V1': cypher(String(ttl)) });
        });
        app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}`);
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
