import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { AttachmentService } from './../../attachment.service';
import { Readable } from 'stream';
import { UserService } from './../../../user/user.service';
import { AttachmentRepository } from './../../attachment.repository';
import AttachmentEntity from './../../attachment.entity';
import { EntityNotFoundException } from './../../../../common/exceptions/entity-not-found-exception';
import { UnauthorizedException } from './../../../../common/exceptions/unathorized-exception';
import { PaginationDTO } from './../../../../common/dto/pagination.dto';
import { ShareFileDTO } from './../../../attachment/dto/shared-attachment.dto';
import { DataSource } from 'typeorm';
import { testDataSource } from './../../../../config/ormconfig.test'; // Importa el DataSource de prueba
import { UserRepository } from './../../../user/user.repository';
import UserEntity from './../../../user/user.entity';

// Mocks de dependencias
jest.mock('@aws-sdk/client-s3');
jest.mock('./../../attachment.repository');
jest.mock('./../../../user/user.service');

describe('AttachmentService Unit Tests', () => {
    let attachmentService: AttachmentService;
    let mockS3Client: jest.Mocked<S3Client>;
    let mockUserService: jest.Mocked<UserService>;
    let mockAttachmentRepository: jest.Mocked<AttachmentRepository>;
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await testDataSource.initialize();
    });

    afterAll(async () => {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(() => {
        mockS3Client = new S3Client({}) as jest.Mocked<S3Client>;
        mockUserService = new UserService(new UserRepository(dataSource)) as jest.Mocked<UserService>;
        mockAttachmentRepository = new AttachmentRepository(dataSource) as jest.Mocked<AttachmentRepository>;
        attachmentService = new AttachmentService(mockS3Client, mockUserService, mockAttachmentRepository);
    });

    afterEach(async () => {
        if (dataSource.isInitialized) {
            const entities = dataSource.entityMetadatas;
            for (const entity of entities) {
                const repository = dataSource.getRepository(entity.name);
                await repository.query(`DELETE FROM ${entity.tableName}`);
            }
        }
    });

    describe('uploadFile', () => {
        it('should upload a file successfully and return the saved attachment', async () => {
            const file = { originalname: 'file.txt', buffer: Buffer.from('content') } as Express.Multer.File;
            const userId = '123';
            const userMock = {
                id: '123',
                userName: 'testUser',
                email: 'test@example.com',
                password: 'hashedPassword',
                createdBy: 'adminUser',
                createdDate: new Date(),
                lastModifiedDate: null,
                lastModifiedBy: null,
                deleteDate: null,
                attachments: [],
                receivedAttachments: []
            } as unknown as UserEntity;

            const savedAttachmentMock = { id: '1', fileName: 'file.txt' } as AttachmentEntity;

            mockUserService.findOne.mockResolvedValue(userMock);
            mockS3Client.send = jest.fn().mockResolvedValue({});
            mockAttachmentRepository.save.mockResolvedValue(savedAttachmentMock);

            const result = await attachmentService.uploadFile(file, userId);

            expect(mockUserService.findOne).toHaveBeenCalledWith({ where: { id: userId } });
            expect(mockS3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
            expect(mockAttachmentRepository.save).toHaveBeenCalledWith(expect.any(AttachmentEntity));
            expect(result).toEqual(savedAttachmentMock);
        });

        it('should throw EntityNotFoundException if user is not found', async () => {
            const file = { originalname: 'file.txt', buffer: Buffer.from('content') } as Express.Multer.File;
            const userId = '123';

            mockUserService.findOne.mockResolvedValue(null);

            await expect(attachmentService.uploadFile(file, userId)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('deleteFile', () => {
        it('should delete a file successfully', async () => {
            const fileId = '1';
            const userId = '123';
            const attachmentMock = { id: fileId, user: { id: userId } } as AttachmentEntity;

            mockAttachmentRepository.findOne.mockResolvedValue(attachmentMock);
            mockAttachmentRepository.softDelete.mockResolvedValue(undefined);

            await attachmentService.deleteFile(fileId, userId);

            expect(mockAttachmentRepository.findOne).toHaveBeenCalledWith({
                where: { id: fileId },
                relations: ['user'],
            });
            expect(mockAttachmentRepository.softDelete).toHaveBeenCalledWith(fileId);
        });

        it('should throw EntityNotFoundException if file is not found', async () => {
            const fileId = '1';
            const userId = '123';

            mockAttachmentRepository.findOne.mockResolvedValue(null);

            await expect(attachmentService.deleteFile(fileId, userId)).rejects.toThrow(EntityNotFoundException);
        });

        it('should throw UnauthorizedException if user does not have permission to delete', async () => {
            const fileId = '1';
            const userId = '123';
            const attachmentMock = { id: fileId, user: { id: '456' } } as AttachmentEntity;

            mockAttachmentRepository.findOne.mockResolvedValue(attachmentMock);

            await expect(attachmentService.deleteFile(fileId, userId)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('updateFileName', () => {
        it('should update the file name successfully', async () => {
            const fileId = '1';
            const userId = '123';
            const newFileName = 'newFile.txt';
            const attachmentMock = { id: fileId, user: { id: userId }, fileName: 'oldFile.txt' } as AttachmentEntity;

            mockAttachmentRepository.findOne.mockResolvedValue(attachmentMock);
            mockAttachmentRepository.save.mockResolvedValue(attachmentMock);

            const result = await attachmentService.updateFileName(fileId, userId, newFileName);

            expect(mockAttachmentRepository.findOne).toHaveBeenCalledWith({
                where: { id: fileId },
                relations: ['user'],
            });
            expect(mockAttachmentRepository.save).toHaveBeenCalledWith(expect.objectContaining({ fileName: newFileName }));
            expect(result).toEqual(attachmentMock);
        });

        it('should throw EntityNotFoundException if file is not found', async () => {
            const fileId = '1';
            const userId = '123';
            const newFileName = 'newFile.txt';

            mockAttachmentRepository.findOne.mockResolvedValue(null);

            await expect(attachmentService.updateFileName(fileId, userId, newFileName)).rejects.toThrow(EntityNotFoundException);
        });

        it('should throw UnauthorizedException if user does not have permission to update', async () => {
            const fileId = '1';
            const userId = '123';
            const newFileName = 'newFile.txt';
            const attachmentMock = { id: fileId, user: { id: '456' } } as AttachmentEntity;

            mockAttachmentRepository.findOne.mockResolvedValue(attachmentMock);

            await expect(attachmentService.updateFileName(fileId, userId, newFileName)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('listUserAttachments', () => {
        it('should return a list of user attachments and shared attachments', async () => {
            const userId = '123';
            const paginationDto: PaginationDTO = { page: 1, limit: 10 };
            const userAttachmentsMock = [{ id: '1' }] as AttachmentEntity[];
            const sharedAttachmentsMock = [{ id: '2' }] as AttachmentEntity[];

            mockAttachmentRepository.findAndCount.mockResolvedValueOnce([userAttachmentsMock, 1]);
            mockAttachmentRepository.findAndCount.mockResolvedValueOnce([sharedAttachmentsMock, 1]);

            const result = await attachmentService.listUserAttachments(userId, paginationDto);

            expect(mockAttachmentRepository.findAndCount).toHaveBeenCalledTimes(2);
            expect(result).toEqual({
                userAttachments: userAttachmentsMock,
                sharedAttachments: sharedAttachmentsMock,
                totalUserAttachments: 1,
                totalSharedAttachments: 1,
                currentPage: paginationDto.page,
                totalPages: 1,
            });
        });
    });

    describe('shareFile', () => {
        it('should share a file successfully', async () => {
            const ownerId = '123';
            const shareFileDto: ShareFileDTO = { fileId: '1', userIds: ['456'] };
            const attachmentMock = {
                id: '1',
                fileName: 'example.txt',
                fileKey: '123/example.txt',
                s3Url: 'https://s3.amazonaws.com/bucket/123/example.txt',
                createdBy: 'adminUser',
                createdDate: new Date(),
                lastModifiedDate: null,
                lastModifiedBy: null,
                deleteDate: null,
                user: {
                    id: ownerId
                } as UserEntity,
                sharedTo: [] as UserEntity[]
            } as unknown as AttachmentEntity;

            const usersMock = [{
                id: '123',
                userName: 'testUser',
                email: 'test@example.com',
                password: 'hashedPassword',
                createdBy: 'adminUser',
                createdDate: new Date(),
                lastModifiedDate: null,
                lastModifiedBy: null,
                deleteDate: null,
                attachments: [],
                receivedAttachments: []
            } as unknown as UserEntity]

            mockAttachmentRepository.findOne.mockResolvedValue(attachmentMock);
            mockUserService.findByIds.mockResolvedValue(usersMock);
            mockAttachmentRepository.save.mockResolvedValue(attachmentMock);

            const result = await attachmentService.shareFile(ownerId, shareFileDto);

            expect(mockAttachmentRepository.findOne).toHaveBeenCalledWith({
                where: { id: shareFileDto.fileId },
                relations: ['user', 'sharedTo'],
            });
            expect(mockUserService.findByIds).toHaveBeenCalledWith(shareFileDto.userIds);
            expect(mockAttachmentRepository.save).toHaveBeenCalledWith(attachmentMock);
            expect(result).toEqual({ message: 'File shared successfully' });
        });
    });

    describe('downloadFile', () => {
        it('should download a file successfully', async () => {
            const fileId = '1';
            const userId = '123';
            const attachmentMock = { id: fileId, user: { id: userId }, fileKey: 'key' } as AttachmentEntity;

            mockAttachmentRepository.findOne.mockResolvedValue(attachmentMock);
            mockS3Client.send = jest.fn().mockResolvedValue({ Body: Readable.from(['file content']) });

            const result = await attachmentService.downloadFile(fileId, userId);

            expect(mockAttachmentRepository.findOne).toHaveBeenCalledWith({
                where: { id: fileId },
                relations: ['user'],
            });
            expect(mockS3Client.send).toHaveBeenCalledWith(expect.any(GetObjectCommand));
            expect(result).toBeInstanceOf(Readable);
        });

        it('should throw UnauthorizedException if user does not have permission to download', async () => {
            const fileId = '1';
            const userId = '123';
            const attachmentMock = { id: fileId, user: { id: '456' } } as AttachmentEntity;

            mockAttachmentRepository.findOne.mockResolvedValue(attachmentMock);

            await expect(attachmentService.downloadFile(fileId, userId)).rejects.toThrow(UnauthorizedException);
        });
    });
});
