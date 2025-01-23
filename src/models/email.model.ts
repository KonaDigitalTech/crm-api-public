import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';
import Lead from './lead.model';
import User from './user.model';
import EmailTemplate from './email-template.model';
import Trainer from './trainer.model';
import Campaign from './campaign.model';
import Batch from './batch.model';
import Learner from './learner.model';
import MainTask from './mainTask.model';

interface EmailAttributes {
    id?: number;
    to: string[];
    bcc?: string[];
    from: string;
    subject: string | null;
    body: string | null;
    emailTemplateId?: number | null;
    leadId?: number;
    batchId?: number;
    userId: number;
    trainerId?: number; // Optional
    campaignId?: number; // Optional
    learnerId?: number;
    mainTaskId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Email extends Model<EmailAttributes> implements EmailAttributes {
    public id!: number;
    public to!: string[];
    public bcc?: string[];
    public from!: string;
    public subject!: string | null;
    public body!: string | null;
    public emailTemplateId?: number | null;
    public leadId?: number;
    public batchId?: number;
    public userId!: number;
    public trainerId?: number; // Optional
    public campaignId?: number; // Optional
    public learnerId?: number;
    public mainTaskId?: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Email.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    to: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    bcc: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    emailTemplateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: EmailTemplate,
            key: 'id',
        },
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    sequelize,
    modelName: 'Email',
    tableName: 'emails',
    timestamps: true
});

// Define associations
Email.belongsTo(User, { foreignKey: 'userId', as: 'createdBy' });
Email.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' });
Email.belongsTo(EmailTemplate, { foreignKey: 'emailTemplateId', as: 'emailTemplate' });
Email.belongsTo(Learner, { foreignKey: 'learnerId', as: 'learner' });  // Add this line
Email.belongsTo(MainTask, { foreignKey: 'mainTaskId', as: 'mainTask' });

export default Email;