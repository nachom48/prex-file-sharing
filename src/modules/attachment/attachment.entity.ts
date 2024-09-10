import { Entity, Column, ManyToOne, JoinTable, ManyToMany  } from 'typeorm';
import UserEntity from '../user/user.entity';
import CommonEntity from './../../common/common.entity';

@Entity('attachment')
export default class AttachmentEntity extends CommonEntity {

    @Column({ nullable: false })
    fileName: string;

    @Column({ nullable: false })
    fileKey: string;

    @Column({ nullable: false })
    s3Url: string;

    @ManyToOne(() => UserEntity, (user) => user.attachments, {
        onDelete: 'CASCADE',
    })
    user: UserEntity;

    @ManyToMany(() => UserEntity, (user) => user.receivedAttachments)
    @JoinTable({
        name: 'received_attachments',
        joinColumn: { name: 'attachment_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    sharedTo: UserEntity[];
}
