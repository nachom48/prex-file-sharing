import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import AttachmentEntity from './attachment.entity';
import { UnauthorizedException } from '../../common/exceptions/unathorized-exception';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found-exception';
import { PaginationDTO } from './../../common/dto/pagination.dto';
import { ShareFileDTO } from './dto/shared-attachment.dto';
import { EntityAlreadySharedException } from '../../common/exceptions/entity-already-shared.exception';
import { AttachmentRepository } from './attachment.repository';
import CommonService from './../../common/common.service';
import { UserService } from './../user/user.service';
import { Readable } from 'stream';

export class AttachmentService extends CommonService<AttachmentEntity> {
  private s3: S3Client;
  private userService: UserService;

  constructor(s3Client:S3Client,userService:UserService,attachmentRepository:AttachmentRepository) {
      super(attachmentRepository);

      this.s3 = s3Client;
      this.userService = userService;
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    const fileKey = `${userId}/${Date.now()}_${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileKey,
      Body: file.buffer,
    };
  
    await this.s3.send(new PutObjectCommand(uploadParams));
  
    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  
    const user = await this.userService.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new EntityNotFoundException('User not found');
    }
  
    const attachment = new AttachmentEntity();
    attachment.fileName = file.originalname;
    attachment.createdBy = user.userName;
    attachment.fileKey = fileKey;
    attachment.s3Url = s3Url;
    attachment.user = user;
  
    const savedAttachment = await this.repository.save(attachment); // Guardar y retornar el objeto completo
  
    return savedAttachment; // Retornar el objeto guardado con el ID asignado
  }

  async deleteFile(id: string, userId: string) {
    const attachment = await this.repository.findOne({ // Cambiar a this.repository
      where: { id },
      relations: ['user'],
    });

    if (!attachment) {
      throw new EntityNotFoundException('Attachment', id);
    }

    if (attachment.user.id !== userId) {
      throw new UnauthorizedException('You do not have permission to delete this file');
    }

    await this.repository.softDelete(attachment.id); // Cambiar a this.repository
  }

  async updateFileName(id: string, userId: string, newFileName: string) {
    try {
      const attachment = await this.repository.findOne({ // Cambiar a this.repository
        where: { id },
        relations: ['user'],
      });

      if (!attachment) {
        throw new EntityNotFoundException('Attachment', id);
      }

      if (attachment.user.id !== userId) {
        throw new UnauthorizedException('You do not have permission to update this file');
      }

      attachment.fileName = newFileName;
      return await this.repository.save(attachment); // Cambiar a this.repository
    } catch (error) {
      if (error instanceof EntityNotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('Error updating the file name');
    }
  }

  async listUserAttachments(userId: string, paginationDto: PaginationDTO) {
    try {
      const { page, limit } = paginationDto;
      const skip = (page - 1) * limit;

      const [userAttachments, userCount] = await this.repository.findAndCount({ // Cambiar a this.repository
        where: { user: { id: userId } },
        skip,
        take: limit,
      });

      const [sharedAttachments, sharedCount] = await this.repository.findAndCount({ // Cambiar a this.repository
        where: {
          sharedTo: { id: userId },
        },
        relations: ['sharedTo'],
        skip,
        take: limit,
      });

      return {
        userAttachments,
        sharedAttachments,
        totalUserAttachments: userCount,
        totalSharedAttachments: sharedCount,
        currentPage: page,
        totalPages: Math.ceil((userCount + sharedCount) / limit),
      };
    } catch (error) {
      console.error('Error retrieving attachments:', error);
      throw new Error('Error retrieving attachments');
    }
  }

  async shareFile(ownerId: string, shareFileDto: ShareFileDTO) {
    const { fileId, userIds } = shareFileDto;

    const attachment = await this.repository.findOne({ // Cambiar a this.repository
      where: { id: fileId },
      relations: ['user', 'sharedTo'],
    });

    if (!attachment) {
      throw new EntityNotFoundException('Attachment', fileId);
    }

    if (attachment.user.id !== ownerId) {
      throw new UnauthorizedException('You do not have permission to share this file');
    }

    const usersToShareWith = await this.userService.findByIds(userIds);
    if (usersToShareWith.length !== userIds.length) {
      throw new Error('Some users not found');
    }

    const alreadySharedUsers = attachment.sharedTo.filter(user =>
      userIds.includes(user.id)
    );

    if (alreadySharedUsers.length === userIds.length) {
      throw new EntityAlreadySharedException('Attachment');
    }

    const newUsersToShareWith = usersToShareWith.filter(
      (      user: { id: string; }) => !alreadySharedUsers.map(u => u.id).includes(user.id)
    );

    attachment.sharedTo = [...attachment.sharedTo, ...newUsersToShareWith];
    await this.repository.save(attachment); // Cambiar a this.repository

    if (alreadySharedUsers.length > 0) {
      return { message: 'File shared with new users successfully, some users already had access' };
    } else {
      return { message: 'File shared successfully' };
    }
  }



 async downloadFile(fileId: string, userId: string): Promise<Readable> {
  // Buscar el archivo en la base de datos
  const attachment = await this.repository.findOne({
    where: { id: fileId },
    relations: ['user'],
  });

  if (!attachment) {
    throw new EntityNotFoundException('Attachment not found');
  }

  if (attachment.user.id !== userId) {
    throw new UnauthorizedException('You do not have permission to download this file');
  }

  // Parámetros para obtener el archivo de S3
  const getObjectParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: attachment.fileKey,
  };

  try {
    const command = new GetObjectCommand(getObjectParams);
    const response = await this.s3.send(command);

    if (!response.Body) {
      throw new Error('Failed to download the file');
    }

    return response.Body as Readable; // Retorna el objeto como un stream de lectura
  } catch (error) {
    console.error('Error downloading file from S3:', error);
    throw new Error('Failed to download the file from S3');
  }
}
}
