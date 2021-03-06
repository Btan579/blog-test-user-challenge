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
                expect(res.body.posts).to.have.lengthOf.least(1);
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
            };

            return chai.request(app)
            .post('/posts')
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'created');
                expect(res.body.title).to.equal(newPost.title);
                expect(res.body.id).to.not.be.null;
                expect(res.body.content).to.equal(newPost.content);
                expect(res.body.author).to.equal(`${newPost.author.firstName} ${newPost.author.lastName}`);

                return BlogPost.findById(res.body.id);
            })
            .then(function(post)    {
                expect(post.title).to.equal(newPost.title);
                expect(post.content).to.equal(newPost.content);
                expect(post.author.firstName).to.equal(newPost.author.firstName);
                expect(post.author.lastName).to.equal(newPost.author.lastName);
            });
        });
    });


    describe('PUT endpoint', function () {
        it('should update fields you send over', function() {
        const updateData = {
            title: 'shrimp shrimp shrimp',
                author: {
                    firstName: 'arnold',
                    lastName:  'palmer'
                },
                content: 'ham, ham, ham'
        };

        return BlogPost
        .findOne()
        .then(function(post) {
            updateData.id = post.id;

            return chai.request(app)
            .put(`/posts/${post.id}`)
            .send(updateData);
        })
        .then(function(res) {
            expect(res).to.have.status(204);

            return BlogPost.findById(updateData.id);
        })
        .then(function(post) {
            expect(post.title).to.equal(updateData.title);
            expect(post.content).to.equal(updateData.content);
            expect(post.author.firstName).to.equal(updateData.author.firstName);
            expect(post.author.lastName).to.equal(updateData.author.lastName);
        });
    });
});

    describe('DELETE endpoint', function() {
        it('delete a post by id', function() {
            let post;

            return BlogPost
            .findOne()
            .then(function(_post) {
                post = _post;
                return chai.request(app).delete(`/posts/${post.id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
                return BlogPost.findById(post.id);
            })
            .then(function(_post) {
                expect(_post).to.be.null;
            });
        });
    });
});
