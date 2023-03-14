const request = require('supertest');

describe('/books', () => {

    it('POST responds with success', async () => {
        return await request(`http://localhost:${process.env.SERVER_PORT}/`)
            .post('/books')
            .send(JSON.stringify({
                "name": "Treasure Island",
                "author": "Robert Louis Stevensonr",
                "publisher": "Cassell and Company",
                "edition": 1,
                "pages": 292,
                "releaseDate": "1983-11-14"
            }))
            .expect(200);
    });

});
