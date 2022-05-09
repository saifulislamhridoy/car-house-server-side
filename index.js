const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// midleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.68qtz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const productCollection = client.db('carHouse').collection('product')
        // POST
        app.post('/product', async (req, res) => {
            const newProduct = req.body
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })
        // GET
        app.get('/product',async(req,res)=>{
            const query ={}
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product)
        })
        // PUT
        app.put('/product/:id',async(req,res)=>{
            const updateQuantity = req.body.newQuantity
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const product = await productCollection.findOne(query)
            const option={upsert:true}
            const updateDoc ={
                $set:{
                    ...product,
                    quantity:updateQuantity

                }
            }
            const result = await productCollection.updateOne(query,updateDoc,option)
            res.send(result)
        })
// Restock Quantity
        app.put('/pd/:id',async(req,res)=>{
            const updateStockQuantity = req.body.stockQuantity
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const product = await productCollection.findOne(query)
            const option={upsert:true}
            const updateDoc ={
                $set:{
                    ...product,
                    quantity:updateStockQuantity

                }
            }
            const result = await productCollection.updateOne(query,updateDoc,option)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running car house server')
})
app.listen(port, () => {
    console.log('Listening to port', port)
})