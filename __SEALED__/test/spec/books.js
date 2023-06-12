const request = require('supertest');
const {ObjectId} = require('mongodb');

describe('/books', () => {

    afterEach(async () => {
        const collections = await database.collections();
        if (collections.some((collection) => collection.collectionName === 'books')) {
            await database.collection('books').deleteMany();
        }
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
            .set('Accept', 'application/json')
            .send(JSON.stringify({
                "publisher": "Cassell and Company",
                "edition": 1,
                "pages": 292,
            }))
            .expect('Content-Type', /json/)
        expect(response.ok).not.to.be.true;
    });

    it('POST adds a new document into the database', async () => {
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
        const document = await database.collection('books').findOne({ _id: new ObjectId(response.body.id) });
        expect(document).not.to.be.null;
    });

    it('POST subsequent request with same key properties fail with error', async () => {
        await request(`http://localhost:${process.env.SERVER_PORT}`)
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
        const response = await request(`http://localhost:${process.env.SERVER_PORT}`)
            .post('/books')
            .set('Accept', 'application/json')
            .send({
                "name": "Treasure Island",
                "author": "Robert Louis Stevensonr",
                "publisher": "Cassell and Company",
                "edition": 1,
                "pages": 400,
                "releaseDate": "1983-10-14"
            });
        expect(response.status).not.to.equal(200);
    });

    it('POST subsequent request with same non key properties respond with success', async () => {
        await request(`http://localhost:${process.env.SERVER_PORT}`)
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
        await request(`http://localhost:${process.env.SERVER_PORT}`)
            .post('/books')
            .set('Accept', 'application/json')
            .send({
                "name": "Treasure Island",
                "author": "Robert Louis Stevensonr",
                "publisher": "Cassell and Company",
                "edition": 2,
                "pages": 292,
                "releaseDate": "1983-11-14"
            })
            .expect('Content-Type', /json/)
            .expect(200);
    });

    describe('/[id]', () => {

        it('GET responds with non 200 on unknown id', async () => {
            const response = await request(`http://localhost:${process.env.SERVER_PORT}`)
                .get('/books/641066069a4d9fc445a8a774');
            expect(response.status).not.to.equal(200);
        });

        it('GET responds with a POST inserted document', async () => {
            const book = {
                "name": "Treasure Island",
                "author": "Robert Louis Stevensonr",
                "publisher": "Cassell and Company",
                "edition": 1,
                "pages": 292,
                "releaseDate": "1983-11-14"
            };
            const post_response = await request(`http://localhost:${process.env.SERVER_PORT}`)
                .post('/books')
                .set('Accept', 'application/json')
                .send(book)
                .expect('Content-Type', /json/)
                .expect(200);
            const get_response = await request(`http://localhost:${process.env.SERVER_PORT}`)
                .get(`/books/${post_response.body.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const {
                _id,
                ...response_book
            } = get_response.body;
            expect(book).to.deep.equal(response_book);
        });

    });

});
