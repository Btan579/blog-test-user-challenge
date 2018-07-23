'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {
    TEST_DATABASE_URL
} = require('../config');
const {
    BlogPost
} = require('../models');
const {
    runServer,
    app,
    closeServer
} = require('../server');

chai.use(chaiHttp);

function seedBlogData() {
    console.info('seeding blog data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateBlogData());
    }
    return BlogPost.insertMany(seedData);
}


function generatePostTitle() {
    const titles = [
        'Pork', 'Chicken', 'Beef', 'Fish', 'Lamb', 'Tofu', 'Seitan', 'Dairy', 'Vegtables', 'Shellfish'];
    return titles[Math.floor(Math.random() * titles.length)];
}

function generatePostContent() {
    const testText = ['Lorem ipsum dolor sit amet, consectetur adipisicing  elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,   quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore     eufugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet,  consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi    ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor   incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia  deserunt mollit anim id est laborum.'];

    return testText[Math.floor(Math.random() * testText.length)];
}

// function generateAuthor () {
//     // const firstNameF = ['John', 'Jill', 'Jack', 'Ashley', 'Amanda'];
//     // const lastNameF = ['Smith', 'Stein', 'Oconner', 'Rogers', 'Obrien'];
//     // const namesF = ['John Smith', 'Jill Stein', 'Jack Oconner', 'Ashley Rogers', 'Amanda Obrien'];
//     // const authorF = namesF[Math.floor(Math.random() * namesF.length)];
//     // const firstNameF = faker.name.firstName();
//     // const lastnameF = faker.name.lastName();
//     const authorF = faker.name.findName();
//     return {
//         authorF
//     };
// }



function generateBlogPostData() {
    return {
        author: faker.name.findName(),
        title: generatePostTitle(),
        content: generatePostContent()

    };
}


function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Blog posts API resource', function() {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedBlogData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
})