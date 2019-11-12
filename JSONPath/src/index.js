const fs = require("fs")
const jp = require("jsonpath")
const jpp = require("json-path-processor");
const { JSONPath } = require("jsonpath-plus");
const jsonQuery = require('json-query')

// Verify args
if (process.argv.length < 3) {
   console.log(" > [JSONPath] Try: yarn start <JSON File>")
   process.exit(0)
}

// Verify if file exists
const filename = process.argv[2]
const filepath = "../" + filename
if (!fs.existsSync(filepath)) {
   console.log(" > [JSONPath] " + filename + " doesn't exists")
   process.exit(0)
}

// Open JSON File
console.log(" > [JSONPath] Opening " + filename)
console.log("")
const JSONFile = fs.readFileSync(filepath)

// Create JSON Object
const JSONObject = JSON.parse(JSONFile.toString())

// Stores all existing movies in JSON
const AllTopicMovies = JSONObject.topicMap.topic.filter(topic => {
   return (topic.instanceOf ? topic.instanceOf.topicRef._href === "#Filme" : false)
})

// A)
const allGenresTopic = JSONObject.topicMap.topic.filter(topic => {
   return (topic.instanceOf ? topic.instanceOf.topicRef._href === "#Genero" : false)
})
// Show
console.log(" > [A] Quais são os tipos de gênero de filmes, sem repetição?")
allGenresTopic.forEach(genre => {
   console.log(" > [A] ID: " + genre._id + " => Gênero: " + genre.baseName.baseNameString)
});
console.log("")

// B)
// Get all movie IDs produced in 2000
var allMovieIDsProducedIn2000 = []
JSONObject.topicMap.association.forEach(topic => {
   const aux = topic.instanceOf
   if (aux) {
      if (aux.topicRef._href === "#filme-ano") {
         if (topic.member[1].topicRef._href === "#id_2000") {
            allMovieIDsProducedIn2000.push(topic.member[0].topicRef._href)
         }
      }
   }
})
// Get all movie names produced in 2000
var allMovieNamesProducedIn2000 = []
allMovieIDsProducedIn2000.forEach(id => {
   const movieTopic = AllTopicMovies.find(topic => {
      return ("#" + topic._id) === id
   })

   if (movieTopic) {
      allMovieNamesProducedIn2000.push(movieTopic.baseName.baseNameString)
   }
})
// Sort all names and show 'em
allMovieNamesProducedIn2000.sort()
console.log(" > [B] Quais são os títulos dos filmes que foram produzidos em 2000, ordenados alfabeticamente?")
allMovieNamesProducedIn2000.forEach(movie => {
   console.log(" > [B] Filme: " + movie)
})
console.log("")

// C)
console.log(" > [C] Quais são os títulos em inglês dos filmes que tem a palavra \"especial\" na sinopse?")
// Verify all movies
AllTopicMovies.forEach(movieTopic => {
   var hasEspecialWord = false

   const occurrences = movieTopic.occurrence
   // Exclude every occurrence that aren't an array
   if (occurrences.length) {
      // Find the object that contains "#sinopse"
      occurrence = occurrences.find(occurrence => {
         if (occurrence)
            return occurrence.scope.topicRef._href === "#sinopse"

         return false
      })
      // Check if the synopsis contains "especial" word
      hasEspecialWord = occurrence.resourceData.includes("especial")
   }

   // If contains, show the title in english
   if (hasEspecialWord)
      console.log(" > [C] " + movieTopic.occurrence[0].resourceData)
})
console.log("")

// D)
console.log(" > [D] Quais são os sites dos filmes que são do tipo \"thriller\"?")
console.log("")

// E)
console.log(" > [E] Quantos filmes contém mais de 3 atores como elenco de apoio?")
console.log("")

// F)
console.log(" > [F] Quais são os ID dos filmes que tem o nome de algum membro do elenco citado na sinopse?")
console.log("")
