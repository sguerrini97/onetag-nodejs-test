const fetch = require('cross-fetch');
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
 * Fetches a JSON response from the specified URL
 * @param {*} url URL to fetch
 * @param {*} headers Request headers
 * @param {*} params Query parameters object
 * @returns 
 */
const fetchJson = async function(url, headers = {}, params = {}) {

    // Add query parameters to the URL
    url = `${url}?${new URLSearchParams(params)}`;

    const response = await fetch(url, {
        headers: headers,
    });

    const json = await response.json();

    return json;
}

/**
 * Retrieve an access token from the Auth service or returns the last one if it's not expired.
 * @param {String} version Version of the access token to retrieve. Defaults to V1.
 * @returns {AccessToken} Acces token
 */
const getAccessToken = async function(version = "V1") {
    if (!_accessTokens.has(version) || _accessTokens.get(version).isExpired()) {
        const accessTokenResponse = await fetchJson(AUTH_SERVICE_URL);
        const token = accessTokenResponse[`TOKEN-${version}`];
        _accessTokens.set(version, new AccessToken(token));
    }

    return _accessTokens.get(version);
};

router.get('/', async (req, res) => {

    try {
        // Get a valid access token for the Songs service
        const accessToken = await getAccessToken('V1');

        // Retrieve the total number of songs
        let songsCount = (await fetchJson(`${SONGS_SERVICE_URL}/count`, {
            'TOKEN-V1': accessToken.token,
        }))?.count ?? 0;

        const genres = new Map();

        let page = 0;
        while (songsCount > 0) {

            // Retrieve a page of songs
            const songsPage = await fetchJson(`${SONGS_SERVICE_URL}/`, {
                'TOKEN-V1': accessToken.token,
            }, {
                limit: SONGS_PER_PAGE,
                offset: (page++) * SONGS_PER_PAGE,
            });

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
