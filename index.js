const express = require('express');

const booksRouter = require('./routes/books');
const songsRouter = require('./routes/songs');

(async () => {
    try {
        const app = express();

        // Middleware for JSON body parsing
        app.use(express.json());

        // Middleware for static HTML files
        app.use('/', express.static(`${__dirname}/public`));

        // Application routes
        app.use('/books', booksRouter);
        app.use('/songs', songsRouter);

        // Custom code
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Listening on http://localhost:${process.env.SERVER_PORT}`);
        });

    } catch(error) {
        console.error(error);
        process.exit(1);
    }
})();
