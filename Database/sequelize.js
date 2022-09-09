import  Sequelize  from 'sequelize';

export const Model = new Sequelize('predb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    await Model.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }