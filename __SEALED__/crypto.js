const crypto = require('crypto');

const secret = '308cd4b3bc25541c66eafed75fa04f76773408f7416a65cc8f662608cf7b3c00';

module.exports.cypher = function(data) {
    const iv = crypto.randomBytes(16);
    const cypher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
    return iv.toString('hex') + Buffer.concat([ cypher.update(JSON.stringify(data)), cypher.final() ]).toString('hex');
};

module.exports.decypher = function(token) {
    const iv = Buffer.from(token.slice(0, 32), 'hex');
    const data = token.slice(32);
    const cypher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
    const json = Buffer.concat([ cypher.update(Buffer.from(data, 'hex')), cypher.final() ]).toString();
    return JSON.parse(json);
};
