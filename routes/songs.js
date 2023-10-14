const axios = require('axios');
const express = require('express');
const router = express.Router();

const AUTH_SERVICE_URL = "http://localhost:9010/access-token";
const SONGS_SERVICE_URL = "http://localhost:9009";
const SONGS_PER_PAGE = 100;

// Structure to hold the Songs service access token across requests
class AccessToken {
    constructor(token, issuedAt = new Date()) {
        this.token = token;
        this.expiresAt = issuedAt.getTime() + 1000 * 60 * 59;
    }

    isExpired = function() {
        return new Date().getTime() > this.expiresAt;
    }
}
let _accessToken = null;

/**
 * Retrieve an access token from the Auth service or the last one if it's not expired.
 * @param {String} version Version of the access token to retrieve. Defaults to V1.
 * @returns Acces token
 */
const getAccessToken = async function(version = "V1") {
    if (!_accessToken || _accessToken.isExpired()) {
        const accessTokenResponse = (await axios({
            method: 'GET',
            url: AUTH_SERVICE_URL,
        }))?.data;

        _accessToken = new AccessToken(accessTokenResponse[`TOKEN-${version}`]);
    }

    return _accessToken;
};

router.get('/', async (req, res) => {

    try {
        // Get a valid access token for the Songs service
        const accessToken = await getAccessToken('V1');

        // Retrieve the total number of songs
        let songsCount = (await axios({
            method: 'GET',
            url: `${SONGS_SERVICE_URL}/count`,
            headers: {
                'TOKEN-V1': accessToken.token,
            },
        }))?.data?.count ?? 0;

        const genres = [];

        let page = 0;
        while (songsCount > 0) {

            // Retrieve a page of songs
            const songsPage = (await axios({
                method: 'GET',
                url: `${SONGS_SERVICE_URL}/`,
                params: {
                    limit: SONGS_PER_PAGE,
                    offset: (page++) * SONGS_PER_PAGE,
                },
                headers: {
                    'TOKEN-V1': accessToken.token,
                },
            }))?.data;

            for (const song of songsPage) {
                // Find the genre in the genres array
                let genre = genres.find(genre => genre.genre === song.genre);
                // Add the genre to the genres array if it's not already there
                if (!genre) {
                    genre = {
                        genre: song.genre,
                        songs: [],
                    };
                    genres.push(genre);
                }

                // Add the song to the genre
                genre.songs.push(song);
            }

            songsCount -= songsPage.length;
        }

        res.status(200).json(genres);
    } catch (err) {
        console.error(err);
        res.status(503).json();
    }
});

module.exports = router;
