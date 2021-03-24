module.exports = async (req, res) => {
    res.send({host: process.env.HOSTNAME});
};