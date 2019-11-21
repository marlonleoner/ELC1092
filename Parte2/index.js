const fs = require('fs')
const Ajv = require('ajv');

// Verify args
if (process.argv.length < 3) {
   console.log("Try: yarn start <JSON File>")
   process.exit(0)
}

// Verify if file exists
const filename = process.argv[2]
const filepath = filename
if (!fs.existsSync(filepath)) {
   console.log(" > [Validator] " + filename + " doesn't exists")
   process.exit(0)
}

// Verify if file is a json file
const fileext = filename.split(".")[1]
if (fileext !== "json") {
   console.log(" > [Validator] The file must be a JSON file.")
   process.exit(0)
}

//
const JSONFile = fs.readFileSync(filepath)

const JSONObject = JSON.parse(JSONFile.toString());

const BaseNameItemSchema = {
   "$id": "/BaseNameItemSchema",
   "type": "object",
   "properties": {
      "scope": {
         "type": "object",
         "properties": {
            "topicRef": { "$ref": "/TopicRefSchema" }
         },
         "required": ["topicRef"]
      },
      "baseNameString": { "type": "string" }
   },
   "required": ["baseNameString"]
}

const BaseNameSchema = {
   "$id": "/BaseNameSchema",
   "anyOf": [
      {
         "type": "object",
         "properties": {
            "baseNameString": { "type": "string" }
         }
      },
      {
         "type": "array",
         "items": { "$ref": "/BaseNameItemSchema" }
      }
   ]
}

const SubjectIndicatorRefSchema = {
   "$id": "/SubjectIndicatorRefSchema",
   "type": "object",
   "properties": {
      "_href": {
         "type": "string"
      }
   },
   "required": ["_href"]
}

const SubjectIdentitySchema = {
   "$id": "/SubjectIdentitySchema",
   "type": "object",
   "properties": {
      "subjectIndicatorRef": { "$ref": "/SubjectIndicatorRefSchema" }
   }
}

const TopicRefSchema = {
   "$id": "/TopicRefSchema",
   "type": "object",
   "properties": {
      "_href": {
         "type": "string"
      }
   },
   "required": ["_href"]
}

const InstanceOfSchema = {
   "$id": "/InstanceOfSchema",
   "type": "object",
   "properties": {
      "topicRef": { "$ref": "/TopicRefSchema" }
   }
}

const TopicItemsSchema = {
   "$id": "/TopicItemsSchema",
   "type": "object",
   "properties": {
      "_id": {
         "type": "string"
      },
      "instanceOf": { "$ref": "/InstanceOfSchema" },
      "subjectIdentity": { "$ref": "/SubjectIdentitySchema" },
      "baseName": { "$ref": "/BaseNameSchema" },
      "occurrence": { "type": ["array", "object"] }
   },
   "required": ["_id", "baseName"]
}

const AssociationItemsSchema = {
   "$id": "/AssociationItemsSchema",
   "type": "object",
   "properties": {

   }
}

const TopicMapSchema = {
   "$id": "/TopicMapSchema",
   "type": "object",
   "properties": {
      "topic": {
         "type": "array",
         "items": { "$ref": "/TopicItemsSchema" },
         "uniqueItemProperties": ["_id"]
      },
      "association": {
         "type": "array",
         "items": { "$ref": "/AssociationItemsSchema" }
      }
   }
}

const Schema = {
   "$id": "/Schema",
   "type": "object",
   "properties": {
      "topicMap": { "$ref": "/TopicMapSchema" }
   }
}

const Validator = new Ajv({
   allErrors: true,
   schemas: [
      Schema,
      TopicMapSchema,
      TopicItemsSchema,
      AssociationItemsSchema,
      InstanceOfSchema,
      TopicRefSchema,
      SubjectIdentitySchema,
      SubjectIndicatorRefSchema,
      BaseNameSchema,
      BaseNameItemSchema
   ]
});
require('ajv-keywords')(Validator, 'uniqueItemProperties');

const validate = Validator.compile(Schema);

const valid = validate(JSONObject);
if (valid) {
   console.log('Valid!');
}
else {
   console.log('Invalid: ' + Validator.errorsText(validate.errors));
}
