const MongoClient = require("mongodb").MongoClient;
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");

/**
 * constants
 */
const uri = "mongodb://localhost:27017/pokemon";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("pokemons").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    const load = loading("Importing the pokedex...").start();


    const data = await fs.readFile(path.join(__dirname, "pokemon.json"), "utf8");
    await db.collection("pokemons").insertMany(JSON.parse(data));
    

    const pokemonTypesRef = await db.collection("pokemons").aggregate([
      { $match: { type_name: { $ne: null } } },
      {
        $group: {
          _id: "$type_name",
          type: { $first: "$type" },
          pokemons: { $sum: 1 },
        },

      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          type: '$type',
          pokemons: '$pokemons'
        },
      },
    ]);
    const pokemonTypes = await pokemonTypesRef.toArray();
    await db.collection("types").insertMany(pokemonTypes);
    
    
    const updatedPokemonTypesRef = db.collection("types").find({});
    const updatedPokemonTypes = await updatedPokemonTypesRef.toArray();
    updatedPokemonTypes.forEach(async ({ _id, name }) => {
      await db.collection("pokemons").updateMany({ type_name: name }, [
        {
          $set: {
            type_id: _id
          },
        },
      ]);
    });
    
    /**
     * Finally, we remove nulls regions from our collection of arrays
     * */
    load.stop();
    console.info(
      `Pokemon and its types created!`
    );
    process.exit();

  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();