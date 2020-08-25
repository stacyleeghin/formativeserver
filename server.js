//this is a Node Express server
var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cors = require('cors')
var mongoose = require('mongoose')

//the model
var Artist = require('./artist-model')
var Type = require('./type-model')

//setup express server
var app = express()
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(logger('dev'))

//setup database connection
var connectionString = 'mongodb://stacy2020:freddie3008@cluster0-shard-00-00.bg9pc.mongodb.net:27017,cluster0-shard-00-01.bg9pc.mongodb.net:27017,cluster0-shard-00-02.bg9pc.mongodb.net:27017/projects-music?ssl=true&replicaSet=atlas-9frhf9-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(connectionString,{ useNewUrlParser: true })
var  db = mongoose.connection
db.once('open', () => console.log('Database connected'))
db.on('error', () => console.log('Database error'))



//setup routes
var router = express.Router();

router.get('/testing', (req, res) => {
	res.send('<h1>Testing is working</h1>')
})

//CRUD projects
router.get('/artists', (req, res) => {
  	Artist.find()
	.then((artist) => {
	    res.json(artist);
  	})
})

router.get('/artists/:id', (req, res) => {
  	Project.findOne({id:req.params.id})
	.then((artist) => {
	    res.json(artist)
 	})
})

router.post('/artists', (req, res) => {

  	var artist = new Artist()
	artist.id = Date.now()
	
	var data = req.body
	// console.log(data)
	Object.assign(artist,data)
	artist.save()
	.then((artist) => {
	  	res.json(artist)
  	})
  
})

router.put('/artists/:id', (req, res) => {

	Artist.findOne({id:req.params.id})
	.then((artist) => {
		var data = req.body
		Object.assign(artist,data)
		return artist.save()	
	})
	.then((artist) => {
		 res.json(artist)
	})

})

router.delete('/artists/:id', (req, res) => {

	Artist.deleteOne({ id: req.params.id })
	.then(() => {
		res.json('deleted')
	})
	
})

//CRUD types


//CRUD users - optional


//use server to serve up routes
app.use('/api', router)

// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort))
