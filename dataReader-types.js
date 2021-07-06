const MongoClient = require("mongodb").MongoClient;
const fs = require("fs").promises;
const commaNumber = require("comma-number");
/**constants */
const uri = "mongodb+srv://admin:admin@cluster0.nnfph.mongodb.net/pokemon?retryWrites=true&w=majority";;
const dbName = "pokemon";
const collectionName = "types";
const fileName = "types.json";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function main() {
    try {
        const start = Date.now();
        await client.connect();
        console.log("connected to database server");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const typesData = await fs.readFile(fileName, "utf-8");
        await collection.insertMany(JSON.parse(typesData));
        const count = await collection.find().count();
        console.log(`there are ${commaNumber(count)} records. This tooks ${(Date.now() - start) / 1000} seconds `);
        console.log(typesData);
        process.exit();
    } catch (error) {
        print(error);
    }
}
main();