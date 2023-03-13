const request = require('supertest');
const { fetch } = require('cross-fetch');
const {MongoClient} = require('mongodb');

let client;

before(async () => {
    client = new MongoClient(`mongodb://localhost:${process.env.DATABASE_PORT}`);
    await client.connect();
    await Promise.all([
        process.env.AUTH_PORT,
        process.env.SONGS_PORT,
        process.env.SERVER_PORT,
    ].map((port) => until(() => fetch(`http://localhost:${port}`))));
});

after(async () => await client.close());

it('/ GET responds with HTML Hello World', async () => {
    await request(`http://localhost:${process.env.SERVER_PORT}`)
        .get('/')
        .expect(200)
});

async function until(predicate, delay = 300) {
    try {
        await predicate();
    } catch (error) {
        await timeout(delay);
        return until(predicate, delay);
    }
}

async function timeout(delay = 0) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}


