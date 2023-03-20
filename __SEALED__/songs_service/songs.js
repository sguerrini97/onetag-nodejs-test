const {faker} = require('@faker-js/faker');

const items = [];
const count = 1800;
faker.seed(0);
faker.random.numeric()
for (let i = 0; i < count; i++) {
    items.push({
        id: faker.datatype.uuid(),
        name: faker.music.songName(),
        author: faker.name.fullName(),
        genre: faker.music.genre(),
        description: faker.lorem.text(),
    });
}

exports.all = function() {
    return items;
};

exports.count = function() {
    return count;
};

exports.get = function(offset = 0, limit) {
    const items = exports.all();
    return items.slice(offset, limit);
};
