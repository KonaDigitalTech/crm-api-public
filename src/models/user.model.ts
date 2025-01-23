import { sequelize } from '../database';

import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the attributes for the User model
export interface UserAttributes {
  id?: number;
  empCode?: string;
  name: string;
  username: string;
  mobile?: string;
  email: string;
  password: string;
  role: string;
  teleCMIAgentId?: string;
  teleCMIPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend the Model class and specify the UserAttributes interface
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public empCode?: string;
  public name!: string;
  public username!: string;
  public mobile?: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public teleCMIAgentId?: string;
  public teleCMIPassword?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Define the User model and specify the attributes
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  empCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  mobile: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teleCMIAgentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  teleCMIPassword: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true
});

export default User;
