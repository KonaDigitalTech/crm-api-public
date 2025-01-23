import { sequelize } from '../database';
import { DataTypes, Model, Sequelize, BelongsToManySetAssociationsMixin } from 'sequelize';
import Lead from './lead.model';
import User from './user.model';
import Campaign from './campaign.model';
import Trainer from './trainer.model';
import Batch from './batch.model';
import Learner from './learner.model'; // Import the Learner model
import MainTask from './mainTask.model';

export interface NoteAttributes {
    id?: number;
    content: string;
    leadId?: number; 
    batchId?: number;
    trainerId?: number;
    campaignId?: number;
    learnerId?: number; // Add learnerId
    mainTaskId?: number; // Add mainTaskId
    leadStage: 'lead' | 'opportunity' | 'learner';
    createdAt?: Date;
    updatedAt?: Date;
}

class Note extends Model<NoteAttributes> implements NoteAttributes {
    public id!: number;
    public content!: string;
    public leadId?: number;
    public batchId?: number;
    public trainerId?: number;
    public campaignId?: number;
    public learnerId?: number; // Add learnerId
    public mainTaskId?: number; // Add mainTaskId
    public leadStage!: 'lead' | 'opportunity' | 'learner';
    public createdAt!: Date;
    public updatedAt!: Date;

    // Add association mixins
    public setUsers!: BelongsToManySetAssociationsMixin<User, number>;
}

Note.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
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
    leadStage: {
        type: DataTypes.ENUM('lead', 'opportunity', 'learner'),
        allowNull: false,
        defaultValue: 'lead'
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
    tableName: 'notes',
    timestamps: true
});

export default Note;

interface MentionAttributes {
    noteId: number;
    userId: number;
}

export class Mention extends Model<MentionAttributes> implements MentionAttributes {
    public noteId!: number;
    public userId!: number;
}

Mention.init({
    noteId: {
        type: DataTypes.INTEGER,
        references: {
            model: Note,
            key: 'id'
        },
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        primaryKey: true
    }
}, {
    sequelize,
    tableName: 'mentions',
    timestamps: false
});

// Associations
User.belongsToMany(Note, { through: Mention, foreignKey: 'userId', otherKey: 'noteId' });
Note.belongsToMany(User, { through: Mention, foreignKey: 'noteId', otherKey: 'userId' });