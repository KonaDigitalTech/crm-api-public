import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../database";
import User from "./user.model";
import Course from "./course.model";
import Batch from "./batch.model";

// Define the attributes for the Lead model
export interface LeadAttributes {
  id?: number;
  name?: string;
  expRegistrationDate?: Date;
  email?: string;
  nextFollowUp?: Date;
  countryCode?: string;
  demoAttendedDate?: Date;
  phone?: string;
  counselledBy?: string;
  fullNumber?: string;
  priceList?: string;
  alternativePhone?: string;
  feeQuoted?: number;
  leadSource?: string;
  opportunitySource?: string;
  leadScore?: string;
  courseList?: string;
  classMode?: string;
  techStack?: string;
  batchTiming: string[] | null;
  leadOwner?: string;
  coldLeadReason?: string;
  leadStatus?: string;
  visitedDate?: Date;
  warmStage?: string;
  expectedwalkindate?: Date;
  description?: string;
  opportunityStage?: string;
  userId?: number;
  leadStage?: string;
  opportunityStatus?: string;

  // feeQuotedDetails: string;
  // visitedStage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Lead model and specify the attributes
class Lead extends Model<LeadAttributes> implements LeadAttributes {
  public static sequelize: Sequelize;
  public id!: number;
  public name!: string;
  public expRegistrationDate?: Date;
  public email!: string;
  public nextFollowUp?: Date;
  public countryCode!: string;
  public demoAttendedDate?: Date;
  public phone!: string;
  public counselledBy!: string;
  public fullNumber!: string;
  public priceList!: string;
  public alternativePhone!: string;
  public feeQuoted!: number;
  public leadSource!: string;
  public opportunitySource!: string;
  public leadScore!: string;
  public courseList!: string;
  public classMode!: string;
  public techStack!: string;
  public batchTiming!: string[] | null;
  public leadOwner!: string;
  public coldLeadReason?: string;
  public leadStatus?: string;
  public visitedDate!: Date;
  public warmStage?: string;
  public expectedwalkindate!: Date;
  public description?: string;

  public opportunityStage?: string;

  public userId?: number;
  public leadStage?: string;
  public opportunityStatus?: string;

  // public feeQuotedDetails!: string;
  // public demoAttendedStage?: string;
  // public visitedStage?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Lead.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expRegistrationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextFollowUp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    demoAttendedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    counselledBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priceList: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternativePhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feeQuoted: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leadSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    opportunitySource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leadScore: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseList: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    classMode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    techStack: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batchTiming: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    leadOwner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coldLeadReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leadStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Not Contacted",
    },
    visitedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    warmStage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expectedwalkindate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    opportunityStage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    leadStage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "lead",
    },
    opportunityStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Visiting",
    },
    // demoAttendedStage: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // visitedStage: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "Lead",
    tableName: "leads",
  }
);

// Define the join table for the many-to-many relationship
export class LeadCourse extends Model {}

LeadCourse.init(
  {},
  {
    sequelize,
    modelName: "LeadCourse",
    tableName: "lead_course",
  }
);

// Define the many-to-many association between Lead and Course
// Lead.belongsToMany(Course, { through: "LeadCourse", foreignKey: "leadId" });
// Course.belongsToMany(Lead, { through: "LeadCourse", foreignKey: "courseId" });

Lead.belongsTo(User, { foreignKey: "userId", as: "createdBy" });

export default Lead;
