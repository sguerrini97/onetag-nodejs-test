const {MongoClient} = require('mongodb');
const {fetch} = require('cross-fetch');
const {until, timeout} = require('./utils');
const {expect} = require('chai');

exports.mochaGlobalSetup = async function () {
    const client = new MongoClient(`mongodb://database:${process.env.DATABASE_PORT}`)
    const result = await Promise.race([
        timeout(3000).then(() => 'timeout'),
        Promise.all([
            client.connect(),
            Promise.all([
                process.env.AUTH_PORT,
                process.env.SONGS_PORT,
                process.env.SERVER_PORT,
            ].map((port) => until(() => fetch(`http://server:${port}`))))
        ]),
    ]);
    if (result === 'timeout') {
        await client.close(true);
        throw new Error('Database unreachable, have you called npm start?');
    }
    global['client'] = client;
    global['expect'] = expect;
    global['database'] = client.db(process.env.DATABASE_NAME);
};

exports.mochaGlobalTeardown = async function () {
    await global['client'].close()
};


