import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';
import User from './user.model';

export interface EmailTemplateAttributes {
    id?: number;
    name: string;
    subject: string;
    htmlContent: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class EmailTemplate extends Model<EmailTemplateAttributes> implements EmailTemplateAttributes {
    public id!: number;
    public name!: string;
    public subject!: string;
    public htmlContent!: string;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

EmailTemplate.init({
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
    subject: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    htmlContent: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    modelName: 'EmailTemplate',
    tableName: 'emailTemplates',
    timestamps: true
});

EmailTemplate.belongsTo(User, { foreignKey: 'userId', as: 'createdBy' });

export default EmailTemplate;
