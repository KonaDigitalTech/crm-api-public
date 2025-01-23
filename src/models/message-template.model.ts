import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';
import User from './user.model';

// Interface for MessageTemplate attributes
export interface MessageTemplateAttributes {
    id?: number;
    name: string;
    type:  'whatsapp' | 'text';
    content: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Sequelize Model for MessageTemplate
class MessageTemplate extends Model<MessageTemplateAttributes> implements MessageTemplateAttributes {
    public id!: number;
    public name!: string;
    public type!: 'whatsapp' | 'text';
    public content!: string;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Define MessageTemplate model
MessageTemplate.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('whatsapp', 'text'),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
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
    modelName: 'MessageTemplate',
    tableName: 'messageTemplates',
    timestamps: true
});

// Define associations
MessageTemplate.belongsTo(User, { foreignKey: 'userId', as: 'createdBy' });

export default MessageTemplate;