const {MongoClient} = require('mongodb');
const {fetch} = require('cross-fetch');
const {until} = require('./utils');
const {expect} = require('chai');

exports.mochaGlobalSetup = async function () {
    const client = new MongoClient(`mongodb://localhost:${process.env.DATABASE_PORT}`)
    global['client'] = client;
    global['expect'] = expect;
    await client.connect();
    global['database'] = client.db(process.env.DATABASE_NAME);
    await Promise.all([
        process.env.AUTH_PORT,
        process.env.SONGS_PORT,
        process.env.SERVER_PORT,
    ].map((port) => until(() => fetch(`http://localhost:${port}`))));
};

exports.mochaGlobalTeardown = async function () {
    await global['client'].close()
};


