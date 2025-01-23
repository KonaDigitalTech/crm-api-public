import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';
import Learner from './learner.model';
import Course from './course.model';

// Define the attributes for the LearnerCourse model
interface LearnerCourseAttributes {
    id?: number;
    learnerId?: number;
    courseId?: number;
    techStack?: string;
    courseComments?: string | null;
    slackAccess?: string | null;
    lmsAccess?: string | null;
    preferableTime?: string | null;
    batchTiming?: string | null;
    modeOfClass?: string | null;
    comment?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

class LearnerCourse extends Model<LearnerCourseAttributes> implements LearnerCourseAttributes {
    public id?: number;
    public learnerId?: number;
    public courseId?: number;
    public techStack?: string;
    public courseComments?: string | null;
    public slackAccess?: string | null;
    public lmsAccess?: string | null;
    public preferableTime?: string | null;
    public batchTiming?: string | null;
    public modeOfClass?: string | null;
    public comment?: string | null;
    public createdAt?: Date;
    public updatedAt?: Date;
}

LearnerCourse.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
    },
    learnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'learners',
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    techStack: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    courseComments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    slackAccess: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lmsAccess: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preferableTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    batchTiming: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    modeOfClass: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
}, {
    sequelize,
    modelName: 'LearnerCourse',
    tableName: 'learnerCourses',
    timestamps: true,
});
// Learner model
Learner.belongsToMany(Course, { through: LearnerCourse, as: 'courses', foreignKey: 'learnerId' });

// Course model
Course.belongsToMany(Learner, { through: LearnerCourse, as: 'learners', foreignKey: 'courseId' });

// LearnerCourse model
LearnerCourse.belongsTo(Learner, { foreignKey: 'learnerId' });
LearnerCourse.belongsTo(Course, { foreignKey: 'courseId' });

export default LearnerCourse;