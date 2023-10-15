const axios = require('axios');
const express = require('express');
const router = express.Router();

// Constant values
const AUTH_SERVICE_URL = "http://localhost:9010/access-token";
const SONGS_SERVICE_URL = "http://localhost:9009";
const SONGS_PER_PAGE = 100;

// Structure to hold the Songs service access token across requests
class AccessToken {
    constructor(token, issuedAt = new Date()) {
        this.token = token;
        this.expiresAt = issuedAt.getTime() + 1000 * 60 * 59; // Token expires after 1 hour, we keep it for 59 minutes
    }

    isExpired = function() {
        return new Date().getTime() > this.expiresAt;
    }
}
const _accessTokens = new Map();

/**
 * Retrieve an access token from the Auth service or returns the last one if it's not expired.
 * @param {String} version Version of the access token to retrieve. Defaults to V1.
 * @returns {AccessToken} Acces token
 */
const getAccessToken = async function(version = "V1") {
    if (!_accessTokens.has(version) || _accessTokens.get(version).isExpired()) {
        const accessTokenResponse = (await axios({
            method: 'GET',
            url: AUTH_SERVICE_URL,
        }))?.data;

        _accessTokens.set(version, new AccessToken(accessTokenResponse[`TOKEN-${version}`]));
    }

    return _accessTokens.get(version);
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

        const genres = new Map();

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
                // Make sure this song's genre is in the genres Map
                if (!genres.has(song.genre)) {
                    genres.set(song.genre, []);
                }

                // Add this song to its genre
                genres.get(song.genre).push(song);
            }

            songsCount -= songsPage.length;
        }

        res.status(200).json(Array.from(genres, ([genre, songs]) => ({
            genre: genre,
            songs: songs
        })));

    } catch (err) {
        console.error(err);
        res.status(503).json();
    }
});

module.exports = router;
