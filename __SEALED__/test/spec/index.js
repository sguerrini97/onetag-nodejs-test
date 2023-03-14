const request = require('supertest');

describe('/', () => {

    it('GET responds with HTML Hello World', async () => {
        const response = await request(`http://localhost:${process.env.SERVER_PORT}/`)
            .get('/')
            .expect('Content-Type', 'text/html')
            .expect(200);
        expect(response.body).to.match(/Hello +World!?/);
    });

})



