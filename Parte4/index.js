const express = require('express')
const nunjucks = require('nunjucks')
const path = require("path")

const app = express()

const GetAllMovies = require("./database")

nunjucks.configure(path.resolve(__dirname, 'public'), {
   autoescape: true,
   express: app,
   watch: true
})

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'njk')

const AllMovies = GetAllMovies()

app.get('/', (req, res) => {
   return res.render('views/index', { movies: AllMovies })
})

const idMiddleware = (req, res, next) => {
   const { id } = req.params
   if (!id) {
      return res.redirect('/')
   }

   return next()
}

app.get('/movie/:id', idMiddleware, (req, res) => {
   const { id } = req.params

   const movie = AllMovies.find(m => m.id === id)
   if (!movie) {
      return res.redirect('/')
   }

   return res.render("views/movies", { movie })
})

app.get('/actor/:id', (req, res) => {
   const { id } = req.params

   const movies = AllMovies.filter(m => m.atores.find(a => a.id === id))
   const actor = movies[0].atores.find(a => a.id === id)
   if (!movies) {
      return res.redirect('/')
   }

   return res.render("views/actors", { movies, actor })
})

app.get('/director/:id', (req, res) => {
   const { id } = req.params

   const movies = AllMovies.filter(m => m.diretor.id === id)
   const director = movies[0].diretor
   if (!movies) {
      return res.redirect('/')
   }

   return res.render("views/directors", { movies, director })
})

app.get('/year/:id', (req, res) => {
   const { id } = req.params

   const movies = AllMovies.filter(m => m.ano === id)
   if (!movies) {
      return res.redirect('/')
   }

   return res.render("views/years", { movies, year: id })
})

app.get('/duration/:id', (req, res) => {
   const { id } = req.params

   const movies = AllMovies.filter(m => m.duracao === id)
   if (!movies) {
      return res.redirect('/')
   }

   return res.render("views/durations", { movies, duration: id })
})

app.get('/genre/:id', (req, res) => {
   const { id } = req.params

   const movies = AllMovies.filter(m => m.genero.id === id)
   const genre = movies[0].genero
   if (!movies) {
      return res.redirect('/')
   }

   return res.render("views/genres", { movies, genre })
})

app.use(function (req, res, next) {
   res.redirect('/')
});

app.listen(3000)
console.log(" > [Parte4] Server running on port 3000")
console.log(" > [Parte4] http://localhost:3000")
