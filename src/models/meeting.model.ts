import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';
import User from './user.model';
import Lead from './lead.model';
import Campaign from './campaign.model';
import Trainer from './trainer.model';
import Batch from './batch.model';
import Learner from './learner.model'; // Import the Learner model
import MainTask from './mainTask.model';

interface MeetingAttributes {
    id?: number;
    meetingName: string;
    location: string;
    zoomMeetingId: string;
    startTime: Date;
    endTime: Date;
    hostId: number;
    participants?: string[];
    leadId?: number;
    batchId?: number;
    userId: number;
    trainerId?: number; // Optional
    campaignId?: number; // Optional
    learnerId?: number; // Optional
    mainTaskId?: number; // Optional
    createdAt?: Date;
    updatedAt?: Date;
}

class Meeting extends Model<MeetingAttributes> implements MeetingAttributes {
    public id!: number;
    public meetingName!: string;
    public location!: string;
    public zoomMeetingId!: string;
    public startTime!: Date;
    public endTime!: Date;
    public hostId!: number;
    public participants!: string[];
    public leadId?: number;
    public batchId?: number;
    public userId!: number;
    public trainerId?: number;
    public campaignId?: number;
    public learnerId?: number; // New field
    public mainTaskId?: number; // New field
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the Meeting model
Meeting.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    meetingName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zoomMeetingId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    participants: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Ensure this type is supported by your database
        allowNull: true,
        defaultValue: []
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    leadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Lead,
            key: 'id',
        },
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Batch,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
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
            model: Learner, // Reference to the Learner model
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
}, {
    sequelize,
    modelName: 'Meeting',
    tableName: 'meetings',
    timestamps: true
});

// Define associations
Meeting.belongsTo(User, { foreignKey: 'hostId', as: 'host' });
Meeting.belongsTo(User, { foreignKey: 'userId', as: 'createdBy' });
Meeting.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' });
Meeting.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
Meeting.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });
Meeting.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });
Meeting.belongsTo(Learner, { foreignKey: 'learnerId', as: 'learner' }); // New association
Meeting.belongsTo(MainTask, { foreignKey: 'mainTaskId', as: 'mainTask' });

export default Meeting;