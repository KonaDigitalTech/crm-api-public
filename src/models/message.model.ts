import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';
import User from './user.model';
import Lead from './lead.model';
import MessageTemplate from './message-template.model';
import Batch from './batch.model';
import Trainer from './trainer.model';
import Campaign from './campaign.model';
import Learner from './learner.model'; // Import Learner model

interface MessageAttributes {
    id?: number;
    phoneNumber: string;
    messageId: string;
    messageContent: string;
    messageTemplateId: number | null;
    leadId?: number;
    batchId?: number;
    trainerId?: number;
    userId: number;
    type: 'whatsapp' | 'text';
    createdAt?: Date;
    updatedAt?: Date;
    campaignId?: number;
    learnerId?: number; // Add learnerId field
}

class Message extends Model<MessageAttributes> implements MessageAttributes {
    public id!: number;
    public phoneNumber!: string;
    public messageId!: string;
    public messageContent!: string;
    public messageTemplateId!: number;
    public leadId?: number;
    public batchId?: number;
    public trainerId?: number;
    public userId!: number;
    public type!: 'whatsapp' | 'text';
    public createdAt!: Date;
    public updatedAt!: Date;
    public campaignId?: number;
    public learnerId?: number; // Add learnerId field
}

Message.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageContent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageTemplateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: MessageTemplate,
            key: 'id'
        }
    },
    leadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Lead,
            key: 'id'
        }
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Batch,
            key: 'id'
        }
    },
    trainerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Trainer,
            key: 'id'
        }
    },
    campaignId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Campaign,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('whatsapp', 'text'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    learnerId: { // Add learnerId field
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Learner,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true
});

// Define associations
Message.belongsTo(User, { foreignKey: 'userId', as: 'createdBy' });
Message.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' });
Message.belongsTo(MessageTemplate, { foreignKey: 'messageTemplateId', as: 'messageTemplate' });
Message.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
Message.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });
Message.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });
Message.belongsTo(Learner, { foreignKey: 'learnerId', as: 'learner' }); // Add learner association

export default Message;