const fs = require("fs")

// Verify args
if (process.argv.length < 3) {
   console.log(" > [JSONPath] Try: yarn start <JSON File>")
   process.exit(0)
}

// Verify if file exists
const filename = process.argv[2]
const filepath = filename
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
      hasEspecialWord = occurrence.resourceData.match(/\bespecial\b/)
   }

   // If contains, show the title in english
   if (hasEspecialWord)
      console.log(" > [C] " + movieTopic.occurrence[0].resourceData)
})
console.log("")

// D)
const allThrillerMovieIDs = []
JSONObject.topicMap.association.forEach(topic => {
   const aux = topic.instanceOf
   if (aux) {
      if (aux.topicRef._href === "#filme-genero") {
         if (topic.member[1].topicRef._href === "#thriller") {
            allThrillerMovieIDs.push(topic.member[0].topicRef._href)
         }
      }
   }
})
console.log(" > [D] Quais são os sites dos filmes que são do tipo \"thriller\"?")
allThrillerMovieIDs.forEach(id => {
   const movieTopic = AllTopicMovies.find(topic => {
      return ("#" + topic._id) === id
   })

   if (movieTopic) {
      const occLength = movieTopic.occurrence.length
      if (movieTopic.occurrence[occLength - 1].resourceRef) {
         console.log(" > [D] " + movieTopic.occurrence[occLength - 1].resourceRef._href)
      }
   }
})
console.log("")

// E)
console.log(" > [E] Quantos filmes contém mais de 3 atores como elenco de apoio?")
const numbersOfMoviesWCastsGT3 = AllTopicMovies.filter(movie => {
   const occurrenceLength = movie.occurrence.length
   if (!occurrenceLength) {
      movie.occurrence = Array(movie.occurrence)
   }

   const elencoApoio = movie.occurrence.filter(occurrence => {
      if (occurrence.scope) {
         return (occurrence.scope.topicRef._href === "#elencoApoio")
      }
      return false
   })

   return elencoApoio.length >= 3
}).length
console.log(" > [E] " + numbersOfMoviesWCastsGT3 + " filmes")
console.log("")

// F)
console.log(" > [F] Quais são os ID dos filmes que tem o nome de algum membro do elenco citado na sinopse?")
const moviesAndTheirActors = []

JSONObject.topicMap.association
   .filter(topic => topic.instanceOf.topicRef._href === '#filme-elenco')
   .forEach(topic => {
      const movieObject = { movieId: "", actors: [] }
      const movieId = topic.member[0].topicRef._href
      const actor = topic.member[1].topicRef._href.replace('#', '').replace(/-/g, ' ')

      // console.log(`Filme = ${movieId}\nAtor = ${actor}\n`)

      // search for movie index in array; if not found, returns -1
      let movieArrayIndex = -1;
      for (let i = 0; i < moviesAndTheirActors.length; i++) {
         if (moviesAndTheirActors[i].movieId === movieId) {
            movieArrayIndex = i;
            break;
         }
         else if (i === moviesAndTheirActors.length - 1) {
            movieArrayIndex = -1;
            break;
         }
      }

      // if movie with the id doesnt exists, add the new one to the array
      if (movieArrayIndex === -1) {
         movieObject.movieId = movieId
         movieObject.actors.push(actor)

         moviesAndTheirActors.push(movieObject)
      }
      else {
         // if movie with the id already exists, add the actor to its id
         moviesAndTheirActors[movieArrayIndex].actors.push(actor)
      }
   })

// removing # from movieId
moviesAndTheirActors.forEach(movie => {
   movie.movieId = movie.movieId.replace('#', '')
})

const moviesWithCitedCastId = []

AllTopicMovies.forEach(movieTopic => {
   let movieObject = false;
   for (let i = 0; i < moviesAndTheirActors.length; i++) {
      if (moviesAndTheirActors[i].movieId === movieTopic._id) {
         movieObject = moviesAndTheirActors[i];
         break;
      }
      else if (i === moviesAndTheirActors.length - 1) {
         movieObject = false;
         break;
      }
   }

   if (movieObject) {
      let hasWord = false;

      const occurrences = movieTopic.occurrence
      // Exclude every occurrence that aren't an array
      if (occurrences.length) {
         // Find the object that contains "#sinopse"
         occurrence = occurrences.find(occurrence => {
            if (occurrence)
               return occurrence.scope.topicRef._href === "#sinopse"

            return false
         })

         if (occurrence) {
            for (let i = 0; i < movieObject.actors.length; i++) {
               const movieActor = movieObject.actors[i]

               let re = new RegExp('\\b' + movieActor + '\\b', 'i')

               hasActor = occurrence.resourceData.match(re)
               if (hasActor) {
                  // console.log(`${movieObject.movieId} | ${movieObject.actors}`)
                  // console.log(occurrence.resourceData + '\n')

                  moviesWithCitedCastId.push(movieObject.movieId)
                  break;
               }
            }
            // hasWord = occurrence.resourceData.match(/\bPatrick\b/)
         }
      }

      // if (hasWord) {
      //    console.log(movieTopic)
      // }
   }
})

// moviesAndTheirActors.forEach(movieObject => console.log(movieObject))

moviesWithCitedCastId.forEach(movieId => console.log(" > [F] " + movieId))

console.log("")
