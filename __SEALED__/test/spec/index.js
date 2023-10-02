const request = require('supertest');

describe('/', () => {

    it('GET responds with HTML Hello World', async () => {
        const response = await request(`http://server:${process.env.SERVER_PORT}`)
            .get('/')
            .set('Accept', 'text/html')
            .expect('Content-Type', /html/)
            .expect(200);
        expect(response.text).to.match(/Hello +World!?/);
    });

})



