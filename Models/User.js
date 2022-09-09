import  Sequelize  from 'sequelize';
import  { Model }  from '../Database/sequelize';

const UserModel = Model.define('users', {
    // Model attributes are defined here
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender:{
        type: Sequelize.STRING
    }
  });

  await User.sync();