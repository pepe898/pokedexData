const Tasting = require('../models/Pokemon');

exports.list = async (req, res) => {
    console.log(req.session);
    try {

    
        const totalPokemons = await Pokemon.find({}).count();
        const typeCountSummaryRef = await Pokemon.aggregate(
            [
                { $match: { type_name: { $ne: null } } },
                {
                    $group: {
                        _id: "$type_name",
                        total: { $sum: 1 }
                    }
                }]);

        const typeCountSummary = typeCountSummaryRef.map(t => ({ name: t._id, total: t.total }));
        res.render("index", { typeCountSummary: typeCountSummary, totalPokemons: totalPokemons, totalTypes: typeCountSummary.length});

    } catch (e) {
        console.log(e);
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}