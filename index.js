const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('mango server is running');
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7xrscoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        const plantsCollection = client.db("mangoGarden").collection("plants");


        // Get All Plants
        app.get('/allplants', async (req, res) => {
            const cursor = plantsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.post("/addplant", async (req, res) => {
            const plant = req.body;
            const result = await plantsCollection.insertOne(plant);
            res.send(result);
        });

        // GET: Latest 6 Plants
        app.get('/newplants', async (req, res) => {
            const plants = await plantsCollection.find().sort({ _id: -1 }).limit(6).toArray();
            res.status(200).json(plants);
        });

        //My plant
        app.get('/myplants', async (req, res) => {
            const email = req.query.email;
            const userPlants = await plantsCollection.find({ userEmail: email }).toArray();
            res.status(200).json(userPlants);
        });

        //get single plant by id
        app.get('/plant/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await plantsCollection.findOne(query);
            res.send(result);
        })

        // update plant
        app.put("/updateplant/:id", async (req, res) => {
            const id = req.params.id;
            const updatedPlant = req.body;
            const result = await plantsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedPlant }
            );
            res.send(result);
        });


        //delete plant
        app.delete('/plant/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await plantsCollection.deleteOne(query);
            res.send(result);
        })

        // GET: Get Single Plant
        app.get('/plant/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid ID format" });
            }
            const plant = await plantsCollection.findOne({ _id: new ObjectId(id) });
            if (!plant) return res.status(404).json({ error: "Plant not found" });
            res.status(200).json(plant);
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Mango server is running on port: ${port}`);
});