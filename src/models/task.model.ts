import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import User from './user.model';
import Lead from './lead.model';
import Batch from './batch.model';
import Trainer from './trainer.model';
import Campaign from './campaign.model';
import Learner from './learner.model';
import MainTask from './mainTask.model';

class ActivityTask extends Model {
    public id!: number;
    public subject!: string;
    public dueDate!: Date;
    public priority!: string;
    public userId!: number;
    public leadId!: number | null;  // Optional
    public batchId!: number | null; // Optional
    public trainerId!: number | null; // Optional
    public campaignId!: number | null; // Optional
    public learnerId!: number | null; // Optional
    public mainTaskId!: number | null; // Optional

    // Define timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ActivityTask.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    leadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //     model: Lead,
        //     key: 'id',
        // },
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Batch,
            key: 'id',
        },
    },
    trainerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Trainer,
            key: 'id',
        },
    },
    campaignId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Campaign,
            key: 'id',
        },
    },
    learnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Learner,
            key: 'id',
        },
    },
    mainTaskId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: MainTask,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    sequelize,
    modelName: 'ActivityTask',
    tableName: 'tasks',
    timestamps: true,
});

// Define associations
ActivityTask.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// ActivityTask.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' });
ActivityTask.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
ActivityTask.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });
ActivityTask.belongsTo(MainTask, { foreignKey: 'mainTaskId', as: 'mainTask' });
ActivityTask.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });
ActivityTask.belongsTo(Learner, { foreignKey: 'learnerId', as: 'learner' }); // Added association for Learner

export default ActivityTask;