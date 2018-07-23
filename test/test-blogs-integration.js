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
        seedData.push({
            author: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            title: faker.lorem.sentence(),
            content: faker.lorem.text()
        });
    }
    return BlogPost.insertMany(seedData);
}


// function generatePostTitle() {
//     const titles = [
//         'Pork', 'Chicken', 'Beef', 'Fish', 'Lamb', 'Tofu', 'Seitan', 'Dairy', 'Vegtables', 'Shellfish'];
//     return titles[Math.floor(Math.random() * titles.length)];
// }

// function generatePostContent() {
//     const testText = 

//     return testText[Math.floor(Math.random() * testText.length)];
// }

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



// function generateBlogPostData() {
//     return {
//         author: { 
//             firstName: faker.name.firstName(), 
//             lastName: faker.name.lastName()
//             },
//         title: faker.lorem.sentence(),
//         content: faker.lorem.text()

//     };
// }


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

    describe('GET endpoint', function() {

        it('should return all existing blog posts', function() {
            let res;
            return chai.request(app)
            .get('/posts')
            .then(function(_res)    {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body.posts).to.have.lengthOf.at.least(1);
                return BlogPost.count();
            })
            .then(function(count) {
                expect(res.body.posts).to.have.lengthOf(count);
            });
        });

        it('should return blog posts with the right fields', function()  {
            let resBlogpost;
            return chai.request(app)
                .get('/posts')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.posts).to.be.a('array');
                    expect(res.body.posts).to.have.lengthOf.at.least(1);

                    res.body.posts.forEach(function(post) {
                        expect(post).to.be.a('object');
                        expect(post).to.include.keys('id', 'title', 'content', 'author', 'created');
                    });
                    resBlogpost = res.body.posts[0];
                    return BlogPost.findById(resBlogpost.id);
                })
                .then(function(post) {
                    expect(resBlogpost.title).to.equal(post.title);
                    expect(resBlogpost.author).to.equal(post.authorName);
                    expect(resBlogpost.content).to.equal(post.content);
                });
        });
    });


    describe('POST endpoint', function() {
        it('should add a new post', function() {
            const newPost = {
                title: faker.lorem.sentence(),
                author: {
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName()
                },
                content: faker.lorem.text()
            }
        })
    })

});