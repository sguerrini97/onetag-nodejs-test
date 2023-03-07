const express = require('express');

(async () => {
    try {
        const port = 9009;
        const app = express();
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.get('access-token', (req, res) => {
            res.send({ 'TOKEN-V1': '' });
        });
        app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}`);
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
