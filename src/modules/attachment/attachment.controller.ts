import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../../common/exceptions/unathorized-exception';
import { isUUID, validateOrReject } from 'class-validator';
import { InvalidIdFormatException } from '../../common/exceptions/invalid-format-exception';
import { UpdateFileNameDTO } from './dto/update-file-name.dto';
import { PaginationDTO } from './../../common/dto/pagination.dto';
import { ShareFileDTO } from './dto/shared-attachment.dto';
import { AttachmentService } from './attachment.service';
import { CommonController } from './../../common/common.controller';
import AttachmentEntity from './attachment.entity';

export default class AttachmentController extends CommonController<AttachmentEntity> {
  private attachmentService: AttachmentService;

  constructor(attachmentService : AttachmentService) {
    super(attachmentService); 
    this.attachmentService = attachmentService; 
  }

  public async uploadAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const userId = req.user.id;
      const result = await this.attachmentService.uploadFile(file, userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!isUUID(id)) {
        throw new InvalidIdFormatException(); 
      }

      if (!req.user) {
        return next(new UnauthorizedException('User not authenticated'));
      }
  
      const userId = req.user.id;
  
      await this.attachmentService.deleteFile(id, userId);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  public async updateFileName(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      if (!id || !isUUID(id)) {
        throw new InvalidIdFormatException();
      }

      const updateFileNameDto = new UpdateFileNameDTO();
      updateFileNameDto.newFileName = req.body.newFileName;

      await validateOrReject(updateFileNameDto);

      if (!req.user) {
        return next(new UnauthorizedException('User not authenticated'));
      }

      const userId = req.user.id;

      const updatedAttachment = await this.attachmentService.updateFileName(id, userId, updateFileNameDto.newFileName);
      res.status(200).json(updatedAttachment);
    } catch (error) {
      next(error);
    }
  }

  public async listAttachments(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new UnauthorizedException('User not authenticated'));
      }
      
      const userId = req.user.id;
      const paginationDto = new PaginationDTO();
      paginationDto.page = Number(req.query.page) || 1;
      paginationDto.limit = Number(req.query.limit) || 10;
      await validateOrReject(paginationDto);
  
      const attachments = await this.attachmentService.listUserAttachments(userId, paginationDto);
      res.status(200).json(attachments);
    } catch (error) {
      next(error);
    }
  }

  public async shareFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new UnauthorizedException('User not authenticated'));
      }

      const shareFileDto = new ShareFileDTO();
      shareFileDto.fileId = req.body.fileId;
      shareFileDto.userIds = req.body.userIds;

      await validateOrReject(shareFileDto);

      const userId = req.user.id;
      await this.attachmentService.shareFile(userId, shareFileDto);

      res.status(200).json({ message: 'File shared successfully' });
    } catch (error) {
      next(error);
    }
  }

  public async downloadAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
  
      if (!isUUID(id)) {
        return next(new InvalidIdFormatException());
      }
  
      if (!req.user) {
        return next(new UnauthorizedException('User not authenticated'));
      }
  
      const userId = req.user.id;
      const fileStream = await this.attachmentService.downloadFile(id, userId);
  
      // Establecer encabezados para la descarga
      res.setHeader('Content-Disposition', `attachment; filename=${id}`);
      res.setHeader('Content-Type', 'application/octet-stream');
  
      // Pipe del stream de S3 a la respuesta de Express
      fileStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
  
  
}
