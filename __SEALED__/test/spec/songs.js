const request = require('supertest');
const songs = require('../../songs_service/songs');

describe('/songs', () => {

    it('GET responds with JSON array', async () => {
        const response = await request(`http://server:${process.env.SERVER_PORT}`)
            .get('/songs')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).to.be.an('array');
    });

    it('GET responds with the correct genres count', async () => {
        const response = await request(`http://server:${process.env.SERVER_PORT}`)
            .get('/songs')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        const genres = [];
        for (const song of songs.all()) {
            if (!genres.includes(song.genre)) {
                genres.push(song.genre);
            }
        }
        expect(response.body.length).to.equal(genres.length);
    });

    it('GET responds with known songs', async function () {
        this.timeout(1000 * 60 * 3);
        const response = await request(`http://server:${process.env.SERVER_PORT}`)
            .get('/songs')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(songs.all()).to.deep.include.members(
            response.body.reduce((songs, genre) => songs.concat(genre.songs), [])
        );
    });

    it('GET responds with a matching total songs count', async () => {
        const response = await request(`http://server:${process.env.SERVER_PORT}`)
            .get('/songs')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        const count = response.body.reduce((count, { songs }) => count + songs.length, 0);
        expect(count).to.equal(songs.count());
    });

    it('GET responds with the correct songs count per genre', async () => {
        const response = await request(`http://server:${process.env.SERVER_PORT}`)
            .get('/songs')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        for (const group of response.body) {
            const count = songs.all().filter((song) => song.genre === group.genre).length;
            expect(group.songs.length).to.equal(count);
        }
    });

})



