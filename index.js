const express = require('express');

(async () => {
    try {
        const app = express();
        // Edit here
        app.listen(8080, () => {
            console.log('Listening on http://localhost:8080');
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
