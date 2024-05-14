const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yjndj5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const foodCollection = client.db('foodDB').collection('food')

    app.get('/food', async(req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/food', async(req, res) => {
        const newFood = req.body;
        console.log(newFood);
        const result = await foodCollection.insertOne(newFood)
        res.send(result);
    })

    app.get('/food/:id', async (req, res) => {
      const food_id = req.params.id;
      const query = { _id: new ObjectId(food_id) }
      const result = await foodCollection.findOne(query);
      res.send(result);
  })
  //
  // app.get('/-route/', async (req, res)=>{
  //   let filter = {};
  //   if (req.query.search) {
  //   filter.r_filter_field = { $regex: req.query.search, $options: "i" };
  //   }
    
  //   const result = await foodCollection.find(filter).toArray();
    
  //   res.send(result);
  //   })
  //


  // my added food items.......
    app.get("/food/email/:email", async (req, res) => {
    const result = await foodCollection.find({ email: req.params.email }).toArray();
    res.send(result);
    
  })
  //delete btn.........
  app.delete('/food/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await foodCollection.deleteOne(query);
    res.send(result);
  })

  // update
  app.get('/food/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await foodCollection.findOne(query);
    res.send(result);

  })
  app.put('/food/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true};
    const updatedFood = req.body;
    const food = {
      $set: {
              name: updatedFood.name,
              subcategory:updatedFood.subcategory,
              photo:updatedFood.photo,
              price:updatedFood.price,
              rating:updatedFood.rating,
              foodOrigin:updatedFood.foodOrigin,
              quantity:updatedFood.quantity,
              itemName:updatedFood.itemName,
              description:updatedFood.description,
      }
    }
    const result = await foodCollection.updateOne(filter, food, options);
    res.send(result)
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
    res.send('Restaurant management project server is running');
})

app.listen(port, () => {
    console.log(`Restaurant Server is running on port : ${port}`);
})