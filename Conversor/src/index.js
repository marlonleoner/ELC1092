const conversor = require("xml-js")
const fs = require("fs")
const he = require('he')
const parser = require("xml2json")

var par = require('fast-xml-parser');

// Verify args
if (process.argv.length < 3) {
   // console.log("Try: " + process.argv[0] + " " + process.argv[1] + " <XML File>")
   console.log("Try: yarn start <XML File>")
   process.exit(0)
}

// Verify if file exists
const filename = process.argv[2]
const filepath = "../" + filename
if (!fs.existsSync(filepath)) {
   console.log(" > [Conversor] " + filename + " doesn't exists")
   process.exit(0)
}

// Open XML File
console.log(" > [Conversor] Opening " + filename)
const XMLFile = fs.readFileSync(filepath)

//default options, need not to set
var options = {
   attributeNamePrefix: "@_",
   attrNodeName: false, //default is 'false'
   textNodeName: "#text",
   ignoreAttributes: false,
   ignoreNameSpace: false,
   parseNodeValue: false,
   parseAttributeValue: false,
   trimValues: true,
   attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
   tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
   stopNodes: ["parse-me-as-string"]
};
// Crea
const JSONName = filename.split(".")[0] + ".json"
const JSONPath = "../" + JSONName

// XML 2 JSON
console.log(" > [Conversor] Converting " + filename + " to " + JSONName)
// const JSONFile = conversor.xml2json(XMLFile.toString(), {
//    compact: false,
//    spaces: 3,
//    ignoreDeclaration: true,
//    ignoreDoctype: true
// })
// const JSONFile = parser.toJson(XMLFile.toString(), {})
const JSONFile = par.parse(XMLFile.toString(), options);

// Saving JSON
console.log(" > [Conversor] Saving " + JSONName)
fs.writeFileSync(JSONPath, JSON.stringify(JSONFile))

console.log(" > [Conversor] Done!")
