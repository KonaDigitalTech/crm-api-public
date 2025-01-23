import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../database';

interface CallAttributes {
    id?: number;
    callerId: string;
    to: string;
    status: string;
    agentId: string;
    userNo: string;
    time: number;
    direction: string;
    answeredSeconds: number;
    isRecorded: boolean;
    filename: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Call extends Model<CallAttributes> implements CallAttributes {
    public id!: number;
    public callerId!: string;
    public to!: string;
    public status!: string;
    public agentId!: string;
    public userNo!: string;
    public time!: number;
    public direction!: string;
    public answeredSeconds!: number;
    public isRecorded!: boolean;
    public filename!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Call.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    callerId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    agentId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    direction: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answeredSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isRecorded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
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
    modelName: 'Call',
    tableName: 'calls',
    timestamps: true
});

export default Call;