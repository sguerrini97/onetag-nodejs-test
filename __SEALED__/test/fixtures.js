const {MongoClient} = require('mongodb');
const {fetch} = require('cross-fetch');
const {until, timeout} = require('./utils');
const {expect} = require('chai');
const dotenv = require('dotenv');
const path = require('path');

exports.mochaGlobalSetup = async function () {
    dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
    const client = new MongoClient(`mongodb://localhost:${process.env.DATABASE_PORT}`)
    const result = await Promise.race([
        timeout(3000).then(() => 'timeout'),
        Promise.all([
            client.connect(),
            Promise.all([
                process.env.AUTH_PORT,
                process.env.SONGS_PORT,
                process.env.SERVER_PORT,
            ].map((port) => until(() => fetch(`http://localhost:${port}`))))
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


