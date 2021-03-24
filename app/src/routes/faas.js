const db = require('../persistence');
const uuid = require('uuid/v4');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    /** en NodeJs para hacer una llamada fuera se utiliza el fetch https://www.npmjs.com/package/node-fetch*/
    fetch('', {
    })
        .then(r => r.json())
        .then(items => {
            newItems = []
            /** TODO: 
             * Aquí ya os toca desarrollar un poco a vosotros:
             * - si el resultado de la funcion no es error iterar sobre los resultados, 
             * - llamar a la función addItem y añadir el resultado en el array newItems*/
            
            /** fin TODO */

            Promise.all(newItems)
                .then(r => {
                    res.send(r);
                });
        });
};
async function addItem(element) {
    const item = {
        id: uuid(),
        name: element.name,
        completed: element.completed,
    };

    await db.storeItem(item);
    return item
}