const fs = require('fs')
const Ajv = require('ajv');

// Verify if file exists
const filename = "GioMovies.json"
if (!fs.existsSync(filename)) {
   console.log(" > [Validator] " + filename + " doesn't exists")
   process.exit(0)
}

// Verify if file is a json file
const fileext = filename.split(".")[1]
if (fileext !== "json") {
   console.log(" > [Validator] The file must be a JSON file.")
   process.exit(0)
}

// JSON File
const JSONFile = fs.readFileSync(filename)

// JSON Object
const JSONObject = JSON.parse(JSONFile.toString());

const MemberSchema = {
   "$id": "/MemberSchema",
   "type": "array",
   "items": {
      "type": "object",
      "properties": {
         "topicRef": { "$ref": "/TopicRefSchema" }
      }
   }
}

const OccurrenceItemSchema = {
   "$id": "/OccurrenceItemSchema",
   "type": "object",
   "properties": {
      "scope": {
         "type": "object",
         "properties": {
            "topicRef": { "$ref": "/TopicRefSchema" }
         },
         "required": ["topicRef"]
      },
      "resourceData": { "type": "string" },
      "instanceOf": { "$ref": "/InstanceOfSchema" },
      "resourceRef": {
         "type": "object",
         "properties": {
            "_href": { "type": "string" }
         }
      }
   }
}

const OccurrenceSchema = {
   "$id": "/OccurrenceSchema",
   "anyOf": [
      {
         "type": "object",
         "properties": {
            "scope": {
               "type": "object",
               "properties": {
                  "topicRef": { "$ref": "/TopicRefSchema" }
               },
               "required": ["topicRef"]
            },
            "resourceData": { "type": "string" }
         }
      },
      {
         "type": "array",
         "items": { "$ref": "/OccurrenceItemSchema" }
      }
   ]
}

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
      "occurrence": { "$ref": "/OccurrenceSchema" }
   },
   "required": ["_id", "baseName"]
}

const AssociationItemsSchema = {
   "$id": "/AssociationItemsSchema",
   "type": "object",
   "properties": {
      "instanceOf": { "$ref": "/InstanceOfSchema" },
      "member": { "$ref": "/MemberSchema" }
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
      BaseNameItemSchema,
      OccurrenceSchema,
      OccurrenceItemSchema,
      MemberSchema
   ]
});
require('ajv-keywords')(Validator, 'uniqueItemProperties');

const validate = Validator.compile(Schema);

const valid = validate(JSONObject);
if (valid) {
   console.log(' > [Parte2] O arquivo JSON é válido!');
}
else {
   console.log(' > [Parte2] ');
   console.log(Validator.errorsText(validate.errors));
}
