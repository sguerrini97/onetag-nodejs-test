const {MongoClient} = require('mongodb');
const {fetch} = require('cross-fetch');
const {until} = require('./utils');

let client;

exports.mochaGlobalSetup = async function () {
    client = new MongoClient(`mongodb://localhost:${process.env.DATABASE_PORT}`);
    await client.connect();
    await Promise.all([
        process.env.AUTH_PORT,
        process.env.SONGS_PORT,
        process.env.SERVER_PORT,
    ].map((port) => until(() => fetch(`http://localhost:${port}`))));
};

exports.mochaGlobalTeardown = async function () {
    await client.close()
};


