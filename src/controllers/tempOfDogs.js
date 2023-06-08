const axios = require('axios');
const {Temperaments} = require('../db')

const getTemperamentsOfApiData = async(req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}?api_key=${process.env.API_KEY}`);
        let allTemperaments = response.data

        let temperaments = allTemperaments.map(item => item.temperament).join(',').split(',').filter(item => item !=='').map((temperament) => temperament.trim());
        temperaments = [...new Set(temperaments)];
        //metodo set me garantiza de que solo se mantengan valores unicos

        await Promise.all(temperaments.map(temp => {
            return Temperaments.findOrCreate({
                where:{name: temp}
            })
        }));
        //Promise.all espera que se cumplan todas operaciones de búsqueda o creación 

        const temperamentsOfDb = await Temperaments.findAll({
            order:["name"]
        });
        if(!temperamentsOfDb.length) throw new Error('Not results');
        const responseTemperaments = temperamentsOfDb.map(item => {
            return {name: item.name, id: item.id}
        });
        return res.status(201).send(responseTemperaments)
    } catch(error) {
        return res.status(500).send(error.message)  
    }
}

module.exports = getTemperamentsOfApiData