const { Dogs, Temperaments } = require('../db');

const newDog = async (req, res) => {
  const { name, height, weight, life_span, image, temperament } = req.body;

  try {
    const temperamentIds = [];
    for (const temp of temperament) {
      const [temperamentDb] = await Temperaments.findOrCreate({
        where: { name: temp },
      });
      temperamentIds.push(temperamentDb.id);
    }
    
    const createDog = await Dogs.create({
     image,
     name,
     height,
     weight,
     life_span
 })

    await createDog.addTemperaments(temperamentIds);

    return res.status(201).json({dog: createDog});
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


module.exports = newDog;