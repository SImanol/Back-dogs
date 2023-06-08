 const axios = require('axios')

const { Dogs, Op } = require('../db');

const getDogByName = async (req, res) => {
  const { name } = req.query;

  try {
    const dbDogs = await Dogs.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
    if (dbDogs.length === 0) {
      const response = await axios.get(`${process.env.API_URL}/?api_key=${process.env.API_KEY}`);
      const apiDogs = await response.data.map((dog) => {
        return {
          id: dog.id,
          image: dog.image.url,
          name: dog.name,
          height: dog.height.metric,
          weight: dog.weight.metric,
          life_span: dog.life_span,
          temperament: dog.temperament
        }
      })
      const filteredDogs = apiDogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()));
      if (!filteredDogs) {
        return res.status(404).json({error: error.message});
      }

      return res.status(200).json(filteredDogs);
    }
    return res.status(200).json( dbDogs);
    
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
module.exports = getDogByName