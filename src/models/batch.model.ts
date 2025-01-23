import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../database";
import Trainer from "./trainer.model";
import Lead from "./lead.model";

export interface BatchAttributes {
  id?: number;
  batchName?: string;
  location?: string;
  slot?: string;
  trainerId?: number;
  batchStatus?: string;
  topicStatus?: string;
  noOfStudents?: number;
  stack?: string;
  startDate?: Date;
  tentativeEndDate?: Date;
  classMode?: string;
  stage?: string;
  comment?: string;
  timing?: string;
  batchStage?: string;
  mentor?: string;
  zoomAccount?: string;
  stackOwner?: string;
  owner?: string;
  batchOwner?: string;
  description?: string;
}

class Batch extends Model<BatchAttributes> implements BatchAttributes {
  public id!: number;
  public batchName?: string;
  public location?: string;
  public slot?: string;
  public trainerId?: number;
  public batchStatus?: string;
  public topicStatus?: string;
  public noOfStudents?: number;
  public stack?: string;
  public startDate?: Date;
  public tentativeEndDate?: Date;
  public classMode?: string;
  public stage?: string;
  public comment?: string;
  public timing?: string;
  public batchStage?: string;
  public mentor?: string;
  public zoomAccount?: string;
  public stackOwner?: string;
  public owner?: string;
  public batchOwner?: string;
  public description?: string;
}

Batch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    batchName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slot: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trainerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Trainer,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    batchStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"Upcoming"
    },
    topicStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    noOfStudents: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stack: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tentativeEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    classMode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batchStage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mentor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zoomAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stackOwner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batchOwner: {
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
    modelName: "Batch",
    tableName: "batches",
  }
);

// Define the join table for the many-to-many relationship
export class BatchLead extends Model {}

BatchLead.init(
  {},
  {
    sequelize,
    modelName: "BatchLead",
    tableName: "batch_lead",
  }
);

// Define the association with the Trainer model

Batch.belongsTo(Trainer, { foreignKey: "trainerId", as: "trainer" });

// Define the many-to-many relationship with Lead
// In Batch model definition
Batch.belongsToMany(Lead, { through: BatchLead, as: "leads" });

// In Lead model definition
Lead.belongsToMany(Batch, { through: BatchLead, as: "batches" });

export default Batch;
