const express = require('express')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vjryr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const hotelsCollection = client.db("airDB").collection("hotels");
    
    app.post('/addHotels', (req,res)=> {
        console.log(req.body.length)
        hotelsCollection.insertMany(req.body)
    })

    app.get('/popularHotels', (req,res) => {
        hotelsCollection.find({})
        .toArray((err, popular) => {
            res.send(popular)
        })
    })

    app.get('/findDataBy/:location', (req, res) => {
        const location = req.params.location;
        hotelsCollection.find({location: location})
        .toArray((err, location)=> {
            res.send(location)
        })
    })

    app.get('/hotelDetails/:id', (req, res) => {
        const id = req.params.id;
        hotelsCollection.find({_id: ObjectId(id)})
        .toArray((err, result) => {
            res.send(result)
        })
    })
});

app.listen(port)