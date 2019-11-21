const path = require("path")
const fs = require("fs")

module.exports = function () {
   const filename = "GioMovies.json"
   const filepath = path.resolve(__dirname, "..", "..", filename)
   const JSONFile = fs.readFileSync(filepath)

   // Create JSON Object
   const JSONObject = JSON.parse(JSONFile.toString())

   const AllTopics = JSONObject.topicMap.topic

   var AllTopicMovies = []
   var AllYears = []
   var AllGenres = []
   var AllDurations = []
   var AllDirectors = []
   var AllActors = []
   AllTopics.forEach(topic => {
      if (topic.instanceOf) {
         const obj = {
            id: topic._id,
            value: topic.baseName.baseNameString
         }

         switch (topic.instanceOf.topicRef._href) {
            case "#Filme":
               AllTopicMovies.push(topic)
               break
            case "#Ano":
               AllYears.push(obj)
               break
            case "#Genero":
               AllGenres.push(obj)
               break
            case "#Duracao":
               AllDurations.push(obj)
               break
            case "#Direcao":
               AllDirectors.push(obj)
               break
            case "#Elenco":
               AllActors.push(obj)
               break
         }
      }
   })

   var AllMovies = []
   AllTopicMovies.forEach(movie => {
      const lenOccurrences = movie.occurrence.length
      if (!lenOccurrences) {
         movie.occurrence = Array(movie.occurrence)
      }

      var occ = {
         id: movie._id,
         titulo: movie.baseName.baseNameString,
         en_titulo: "",
         distribuicao: "",
         sinopse: "",
         elencoApoio: [],
         site: "",
         ano: "",
         diretor: {},
         duracao: "",
         atores: [],
         genero: {}
      }

      movie.occurrence.forEach(occurrence => {
         if (occurrence.scope) {
            switch (occurrence.scope.topicRef._href) {
               case '#ingles':
                  occ.en_titulo = occurrence.resourceData
                  break
               case '#distribuicao':
                  occ.distribuicao = occurrence.resourceData
                  break
               case '#sinopse':
                  occ.sinopse = occurrence.resourceData
                  break
               case '#elencoApoio':
                  occ.elencoApoio = [...occ.elencoApoio, occurrence.resourceData]
                  break
            }
         }
         else if (occurrence.instanceOf) {
            switch (occurrence.instanceOf.topicRef._href) {
               case '#site':
                  occ.site = occurrence.resourceRef._href
                  break
            }
         }
      })

      AllMovies.push(occ)
   })

   const Associations = JSONObject.topicMap.association
   Associations.forEach(association => {
      const movie_id = association.member[0].topicRef._href
      const assoc_id = association.member[1].topicRef._href

      const movie_index = AllMovies.findIndex(m => ("#" + m.id) === movie_id)

      switch (association.instanceOf.topicRef._href) {
         case "#filme-ano":
            const year = AllYears.find(y => ("#" + y.id) === assoc_id)
            AllMovies[movie_index].ano = year.value
            break
         case "#filme-direcao":
            const director = AllDirectors.find(d => ("#" + d.id) === assoc_id)
            AllMovies[movie_index].diretor = { id: director.id, value: director.value }
            break
         case "#filme-duracao":
            const duration = AllDurations.find(d => ("#" + d.id) === assoc_id)
            AllMovies[movie_index].duracao = duration.value
            break
         case "#filme-elenco":
            var actor = AllActors.find(a => ("#" + a.id) === assoc_id)
            if (!actor) {
               actor = AllDirectors.find(d => ("#" + d.id) === assoc_id)
            }
            AllMovies[movie_index].atores = [...AllMovies[movie_index].atores, { id: actor.id, value: actor.value }]
            break
         case "#filme-genero":
            const genre = AllGenres.find(g => ("#" + g.id) === assoc_id)
            AllMovies[movie_index].genero = { id: genre.id, value: genre.value }
            break
      }
   })

   return AllMovies
}

