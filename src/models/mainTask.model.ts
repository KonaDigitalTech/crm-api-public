import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import Learner from "./learner.model";

export interface MainTaskAttributes {
  id?: number;
  taskOwner?: string;
  assignTo?: string;
  dueDate?: Date;
  subject?: string;
  source?: string;
  note?: string;
  learnerId?: number;
  batch?: string;
  priority?: string;
  status?: string;
  reminder?: boolean;
  taskType?: string;
  description?: string;
}

class MainTask extends Model<MainTaskAttributes> implements MainTaskAttributes {
  public id!: number;
  public taskOwner?: string;
  public assignTo?: string;
  public dueDate?: Date;
  public subject?: string;
  public source?: string;
  public note?: string;
  public learnerId?: number;
  public batch?: string;
  public priority?: string;
  public status?: string;
  public reminder?: boolean;
  public taskType?: string;
  public description?: string;
}

MainTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    taskOwner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    learnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Learner,
        key: "id",
      },
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reminder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taskType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "MainTask",
    tableName: "mainTask",
    timestamps: true,
  }
);

MainTask.belongsTo(Learner, { foreignKey: "learnerId", as: "learner" });

export default MainTask;
