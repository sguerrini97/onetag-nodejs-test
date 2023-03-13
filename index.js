const express = require('express');

(async () => {
    try {
        const app = express();
        // Custom code
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Listening on http://localhost:${process.env.SERVER_PORT}`);
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
