const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
require('dotenv').config()
const port = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// DB CONNECT
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmhhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function crudeUsers() {
    try {
        await client.connect();
        // console.log('db connected')
        const database = client.db('imageUpload');
        const serviceCollection = database.collection('service');

        // GET API
        /* app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const usersArray = await cursor.toArray();
            res.send(usersArray)
        }); */

        // POST API
        app.post('/service', async (req, res) => {
            /* console.log('body', req.body);
            console.log('file', req.files);
            res.json({ success: true }); */

            const title = req.body.title;
            const img = req.files.image;
            const imgData = img.data;
            const imgEncoded = imgData.toString('base64');
            const imgBuffer = Buffer.from(imgEncoded, 'base64')
            const serviceInfo = {
                title,
                image: imgBuffer
            }
            const result = await serviceCollection.insertOne(serviceInfo);
            res.json(result);
        });


        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find({});
            const service = await cursor.toArray();
            res.json(service);
        });

    } finally {
        // await client.close();
    }
}
crudeUsers().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server running')
});

app.listen(port, () => {
    console.log('server running on ', port)
});