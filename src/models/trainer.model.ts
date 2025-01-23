import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export interface TrainerAttributes {
  id?: number;
  trainerName?: string;
  trainerOwner?: string;
  phone?: string;
  idProof?: string;
  email?: string;
  techStack?: string;
  trainerStatus?: string;
  batches?: string;
  freeSlots?: string;
  location?: string;

  description?: string;
  // batchStage?: string;

  slackStage?: string;
  trainerId?: string;
  joiningDate?: Date;
  working?: string;
  commercialNote?: string;
  trainerNote?: string;
}

class Trainer extends Model<TrainerAttributes> implements TrainerAttributes {
  public id!: number;
  public trainerName?: string;
  public trainerOwner?: string;
  public description?: string;
  public idProof?: string;
  public trainerStatus?: string;
  public freeSlots?: string;
  public techStack?: string;
  public phone?: string;
  public email?: string;
  public location?: string;
  public batches?: string;
  // public batchStage?: string;
  public slackStage?: string;
  public trainerId?: string;
  public joiningDate?: Date;
  public working?: string;
  public commercialNote?: string;
  public trainerNote?: string;
}

Trainer.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trainerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trainerOwner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  idProof: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trainerStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  freeSlots: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  techStack: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  batches: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // batchStage: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  slackStage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trainerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  working: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commercialNote: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trainerNote: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Trainer',
  tableName: 'trainers',
});

export default Trainer;