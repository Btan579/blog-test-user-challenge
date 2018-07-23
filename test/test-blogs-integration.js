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