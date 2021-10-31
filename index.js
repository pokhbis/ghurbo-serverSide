const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cghak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('ghurbo');
        const tourCollection = database.collection('tours');
        const bookingCollection = database.collection('myBooking');




        //GET API
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
            res.send(result.acknowledged);
        })
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