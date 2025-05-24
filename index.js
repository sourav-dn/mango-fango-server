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



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7xrscoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



client.connect()
    .then(() => {
        console.log("MongoDB connected");

        const database = client.db("mangoGarden");
        const plantsCollection = database.collection("plants");

        // Add plant route
        app.post('/addplant', (req, res) => {
            const plant = req.body;
            plantsCollection.insertOne(plant)
                .then(result => {
                    res.status(200).json({ message: 'Plant added successfully', insertedId: result.insertedId });
                })
                .catch(err => {
                    res.status(500).json({ error: 'Failed to add plant', details: err.message });
                });
        });
        


        

        




        






            // ✅ Get Single Plant by ID
            app.get('/plant/:id', async (req, res) => {
            const id = req.params.id;

            // ✅ Check if ID is valid ObjectId
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid ID format" });
            }

            try {
                const plant = await plantsCollection.findOne({ _id: new ObjectId(id) });

                if (!plant) {
                    return res.status(404).json({ error: "Plant not found" });
                }

                res.status(200).json(plant);
            } catch (err) {
                res.status(500).json({ error: 'Failed to fetch plant', details: err.message });
            }
        });
    })
    .catch(err => {
        console.error("MongoDB connection failed:", err);
    });

app.listen(port, () => {
    console.log(`mango server is running on port: ${port}`);
});