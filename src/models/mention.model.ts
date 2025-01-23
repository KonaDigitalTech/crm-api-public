import { sequelize } from '../database';
import { DataTypes, Model } from 'sequelize';
import Note from './note.model';
import User from './user.model';

export interface MentionAttributes {
  noteId: number;
  userId: number;
}

class Mention extends Model<MentionAttributes> implements MentionAttributes {
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

export default Mention;

User.belongsToMany(Note, { through: Mention, foreignKey: 'userId', otherKey: 'noteId' });
Note.belongsToMany(User, { through: Mention, foreignKey: 'noteId', otherKey: 'userId' });