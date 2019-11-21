const fs = require("fs")
const he = require('he')

var conversor = require('fast-xml-parser');

// Verify if file exists
const filename = "GioMovies.xtm"
if (!fs.existsSync(filename)) {
   console.log(" > [Parte1] " + filename + " doesn't exists")
   process.exit(0)
}

// Open XML File
console.log(" > [Parte1] Opening " + filename)
const XMLFile = fs.readFileSync(filename)

//default options, need not to set
var options = {
   attributeNamePrefix: "_",
   ignoreAttributes: false,
   ignoreNameSpace: false,
   parseNodeValue: false,
   parseAttributeValue: false,
   trimValues: false,
   attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
   tagValueProcessor: (val, tagName) => {
      if (!val.replace(/\s/g, '').length) {
         return ""
      }
      return val
   },
};
// Create JSON
const JSONName = filename.split(".")[0] + ".json"

// XML 2 JSON
console.log(" > [Parte1] Converting " + filename + " to " + JSONName)
const JSONFile = conversor.parse(XMLFile.toString(), options);

// Saving JSON
console.log(" > [Parte1] Saving " + JSONName)
fs.writeFileSync(JSONName, JSON.stringify(JSONFile))

console.log(" > [Parte1] Done!")
