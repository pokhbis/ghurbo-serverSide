const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;
//middleware 
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cghak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('ghurbo');
        const tourCollection = database.collection('tours');
        const bookingCollection = database.collection('myBooking');




        //GET  API
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

        //POST API
        app.post('/tours', async (req, res) => {
            const tours = req.body;
            console.log("hit post api", tours);


            const result = await tourCollection.insertOne(tour);
            console.log(result);
            res.json(result);
        });



        // Adding Booking POST API
        app.post('/myBooking', async (req, res) => {

            const booking = req.body;
            console.log("booking", booking);
            res.send('booking processed');
        })

        //addTours post api
        app.post('/addTours', async (req, res) => {
            console.log(req.body);
            const result = await tourCollection.insertOne(req.body);
            res.send(result.insertedId);
        })








        //delete tours from the database
        app.delete("/deleteTours/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await tourCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.send(result);
        });
        // get single prodcut

        app.get("/tour/:id", (req, res) => {
            console.log(req.params.id);
            tourCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray((err, results) => {
                    res.send(results[0]);
                });
        });








        //get all posts (tours)


        //add myBooking post api
        app.post('/myBooking', async (req, res) => {
            console.log(req.body);
            const result = await bookingCollection.insertOne(req.body);
            res.send(result.acknowledged);
        })



    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running ghurbo');
});

app.listen(port, () => {
    console.log("Ghurbo Running on port", port);
})