const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wdjom0q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const myToysCollections = client.db('myToysCollection').collection('myToys');
    const carTabs = client.db('myToysCollection').collection('carTabs');
    const carTabIndexes = client.db('myToysCollection').collection('carTabIndexes');

    // my toys

    app.delete('/add/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myToysCollections.deleteOne(query);
      res.send(result);
    })

    app.get('/add/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myToysCollections.findOne(query);
      res.send(result);
    })

    // add

    app.patch('/add/:id', async (req, res) => {
      const id = req.params.id;
      const info = req.body;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: info.price,
          description: info.description,
          quantity: info.quantity
        }
      };
      const result = await myToysCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    app.post('/add-car', async (req, res) => {
      const toyInfo = req.body;
      console.log(toyInfo);
      const result = await myToysCollections.insertOne(toyInfo);
      res.send(result);
    })

    app.get('/add', async (req, res) => {
      const result = await myToysCollections.find().toArray();
      res.send(result);
    })

    app.get('/add/sort/:id', async (req, res) => {
      const sortMethod = parseInt(req.params.id);
      const sortDirection = sortMethod === 1 ? 1 : -1;

      const result = await myToysCollections.find().toArray();
      const sortedResult = result.sort((a, b) => {
        const priceA = a.price;
        const priceB = b.price;
        return (priceA - priceB) * sortDirection;
      });
      res.send(sortedResult);
    })






    app.get('/add/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myToysCollections.findOne(query);
      res.send(result);
    })

    //car

    app.get('/car', async (req, res) => {
      const result = await carTabIndexes.find().toArray();
      res.send(result);
    })
    app.get('/car-details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carTabs.findOne(query);
      res.send(result);
    })

    app.get('/car/all', async (req, res) => {
      const result = await carTabs.find().toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Toy Bazar is Running');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})