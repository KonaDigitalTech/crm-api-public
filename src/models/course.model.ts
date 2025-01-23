import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';

// Define the attributes for the Course model
interface CourseAttributes {
    id?: number;
    name: string;
    description: string;
    imgSrc: string | null;
    fee: number;
    brochureUrl: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

class Course extends Model<CourseAttributes> implements CourseAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public imgSrc!: string; 
    public fee!: number; 
    public brochureUrl!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Course.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgSrc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fee: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    brochureUrl: {
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
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true
});

export default Course;
