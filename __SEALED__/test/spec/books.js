const request = require('supertest');

describe('/books', () => {

    afterEach(async () => {
        await database.collection('books').drop();
    });

    it('POST responds with 200 on correct body', async () => {
        const response = await request(`http://localhost:${process.env.SERVER_PORT}`)
            .post('/books')
            .set('Accept', 'application/json')
            .send({
                "name": "Treasure Island",
                "author": "Robert Louis Stevensonr",
                "publisher": "Cassell and Company",
                "edition": 1,
                "pages": 292,
                "releaseDate": "1983-11-14"
            })
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body.id).to.exist;
        expect(response.body.id).to.be.a('string');
    });

    it('POST responds with 400 on invalid body', async () => {
        const response = await request(`http://localhost:${process.env.SERVER_PORT}`)
            .post('/books')
            .send(JSON.stringify({
                "publisher": "Cassell and Company",
                "edition": 1,
                "pages": 292,
            }));
        expect(response.ok).not.to.be.true;
    });

    it('POST inserts a new document', async () => {
        const response = await request(`http://localhost:${process.env.SERVER_PORT}/`)
            .post('/books')
            .send(JSON.stringify({
                "name": "Treasure Island",
                "author": "Robert Louis Stevensonr",
                "publisher": "Cassell and Company",
                "edition": 1,
                "pages": 292,
                "releaseDate": "1983-11-14"
            }))
            .expect('Content-Type', /json/)
            .expect(200);
        const document = await database.collection('books').findOne({ _id: response.body.id });
        expect(document).not.to.be.null;
    });

});
