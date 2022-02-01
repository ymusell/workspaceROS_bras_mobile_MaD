
"use strict";

let AddTwoInts = require('./AddTwoInts.js')
let TestMultipleRequestFields = require('./TestMultipleRequestFields.js')
let TestRequestAndResponse = require('./TestRequestAndResponse.js')
let TestArrayRequest = require('./TestArrayRequest.js')
let TestEmpty = require('./TestEmpty.js')
let TestRequestOnly = require('./TestRequestOnly.js')
let TestMultipleResponseFields = require('./TestMultipleResponseFields.js')
let TestNestedService = require('./TestNestedService.js')
let TestResponseOnly = require('./TestResponseOnly.js')
let SendBytes = require('./SendBytes.js')

module.exports = {
  AddTwoInts: AddTwoInts,
  TestMultipleRequestFields: TestMultipleRequestFields,
  TestRequestAndResponse: TestRequestAndResponse,
  TestArrayRequest: TestArrayRequest,
  TestEmpty: TestEmpty,
  TestRequestOnly: TestRequestOnly,
  TestMultipleResponseFields: TestMultipleResponseFields,
  TestNestedService: TestNestedService,
  TestResponseOnly: TestResponseOnly,
  SendBytes: SendBytes,
};
