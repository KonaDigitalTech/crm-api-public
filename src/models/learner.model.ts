import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import User from "./user.model";
import Batch from "./batch.model";

// Interfaces for defining types
interface LearnerAttributes {
  id: number;
  name?: string;
  idProof?: string;
  phone?: string;
  dateOfBirth?: Date;
  email?: string;
  registeredDate?: Date;
  location?: string;
  batchId?: number;
  source?: string;
  description?: string;
  totalFees?: string;
  modeofInstallmentpayment?: string;
  feesPaid?: string;
  instalment1Screenshot?: string;
  dueAmount?: string;
  dueDate?: Date;
  status?: string;

  // alternatePhone?: string;
  // attendedDemo?: string;
  // leadCreatedTime?: Date;
  // counselingDoneBy?: number;
  // exchangeRate?: string;
  // learnerOwner?: number;
  // currency?: string;
  // learnerStage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Model class definition
class Learner extends Model {
  public id!: number;
  public name!: string;
  public idProof!: string;
  public phone!: string;
  public dateOfBirth!: Date;
  public email!: string;
  public registeredDate!: Date;
  public location!: string;
  public batchId!: string[];
  public source!: string;
  public description?: string;
  public totalFees!: string;
  public modeofInstallmentpayment!: string[];
  public feesPaid!: string;
  public instalment1Screenshot!: string;
  public dueAmount!: string;
  public dueDate!: Date;
  public status!: string;

  // public alternatePhone?: string;
  // public attendedDemo?: string;
  // public leadCreatedTime?: Date;
  // public counselingDoneBy?: number;
  // public exchangeRate?: string;
  // public learnerOwner?: number;
  // public currency?: string;
  // public learnerStage?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Model initialization
Learner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idProof: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registeredDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batchId: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      // references: {
        //   model: User,
      //   key: "id",
      // },
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalFees: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modeofInstallmentpayment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feesPaid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instalment1Screenshot: {
      type:  DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      // allowNull: true,
    },
    dueAmount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Upcoming",
    },

    // alternatePhone: {
    //   type: DataTypes.STRING,
    // },
    // attendedDemo: {
    //   type: DataTypes.STRING,
    // },
    // leadCreatedTime: {
    //   type: DataTypes.DATE,
    // },
    // counselingDoneBy: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
    // exchangeRate: {
    //   type: DataTypes.STRING,
    // },
    // learnerOwner: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
    // currency: {
    //   type: DataTypes.STRING,
    // },
    // learnerStage: {
    //   type: DataTypes.STRING,
    // },
  },
  {
    sequelize,
    tableName: "learners",
    timestamps: true,
  }
);

// Define associations
// Learner.belongsTo(User, { foreignKey: "counselingDoneBy", as: "counselor" });
// Learner.belongsTo(User, { foreignKey: "learnerOwner", as: "owner" });

export class LearnerBatch extends Model {}

LearnerBatch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    learnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "learnerId",
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "batchId",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "LearnerBatch",
    tableName: "learner_batch",
  }
);
LearnerBatch.belongsTo(Batch, { foreignKey: "batchId" });

Learner.belongsToMany(Batch, { through: "LearnerBatch", as: "batches" });
Batch.belongsToMany(Learner, { through: "LearnerBatch", as: "learners" });

export default Learner;
