import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import User from "./user.model";
import Course from "./course.model";

class Campaign extends Model {
  public id!: number;
  public name!: string;
  public status!: string;
  public type!: string;
  public campaignDate!: Date;
  public endDate!: Date;
  public campaignOwner!: number;
  public phone!: string;
  public courseId!: string;
  public active!: string;
  public amountSpent!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Campaign.init(
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
    status: {
      type: DataTypes.STRING,
      defaultValue: "Upcoming",
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    campaignDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    campaignOwner: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: true,
      // references: {
      //     model: Course,
      //     key: 'id'
      // }
    },
    active: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amountSpent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Campaign",
    tableName: "campaigns",
    timestamps: true,
  }
);

Campaign.belongsTo(User, { foreignKey: "campaignOwner", as: "campaignOwnerName" });

export default Campaign;
