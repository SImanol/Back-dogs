const getAllDogs = require('./allDogs');

const getDogById = async (idRaza) => {
  const allDogs = await getAllDogs();
  const dog = allDogs.find((dog) => dog.id === Number(idRaza) || dog.id === (idRaza));

  if (dog) {
    return { dog };
  } else {
    throw new Error('No dog found with the specified ID');
  }
};

module.exports = getDogById;
    