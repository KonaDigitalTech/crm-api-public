import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';
import Batch from './batch.model';

// Define the attributes for the BatchTopic model
interface BatchTopicAttributes {
    id?: number;
    batchId?: number | null;
    date?: Date | null;
    topic?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    attendance?: string | null;
    isVideoUploaded?: boolean | null;
    createdAt?: Date;
    updatedAt?: Date;
}

class BatchTopic extends Model<BatchTopicAttributes> implements BatchTopicAttributes {
    public id!: number;
    public batchId!: number | null;
    public date!: Date | null;
    public topic!: string | null;
    public startTime!: string | null;
    public endTime!: string | null;
    public attendance!: string | null;
    public isVideoUploaded!: boolean | null;
    public createdAt!: Date;
    public updatedAt!: Date;
}

BatchTopic.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'batches',
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    startTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    endTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    attendance: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isVideoUploaded: {
        type: DataTypes.BOOLEAN,
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
    modelName: 'BatchTopic',
    tableName: 'batchTopics',
    timestamps: true
});

// Define the relationship between BatchTopic and Batch
BatchTopic.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });

export default BatchTopic;
