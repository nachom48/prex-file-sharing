import { Router } from 'express';
import multer from 'multer';
import AttachmentController from './attachment.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { AppDataSource } from '../../config/database';
import { AttachmentService } from './attachment.service';
import { S3ClientSingleton } from './../../config/s3-client';
import { UserService } from './../user/user.service';
import { UserRepository } from './../user/user.repository';
import { AttachmentRepository } from './attachment.repository';

const router = Router();
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

const attachmentController = new AttachmentController(
  new AttachmentService(
    S3ClientSingleton.getInstance(),
    new UserService(
      new UserRepository(AppDataSource)),
    new AttachmentRepository(AppDataSource)
  ));

/**
 * @swagger
 * /api/attachments/list:
 *   get:
 *     summary: List user attachments
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user attachments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userAttachments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AttachmentDTO'  # Asegúrate que este nombre coincida con la definición
 *                 sharedAttachments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AttachmentDTO'
 */
router.get(
  '/list',
  authMiddleware,
  (req, res, next) => attachmentController.listAttachments(req, res, next)
);

/**
 * @swagger
 * /api/attachments/upload:
 *   post:
 *     summary: Upload a new attachment
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Attachment uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttachmentDTO'
 *       400:
 *         description: No file uploaded or invalid input
 *       401:
 *         description: User not authenticated
 */
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  (req, res, next) => attachmentController.uploadAttachment(req, res, next)
);

/**
 * @swagger
 * /api/attachments/deleteFile/{id}:
 *   delete:
 *     summary: Delete an attachment by ID
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the attachment to delete
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Attachment not found
 */
router.delete(
  '/deleteFile/:id',
  authMiddleware,
  (req, res, next) => attachmentController.deleteAttachment(req, res, next)
);

/**
 * @swagger
 * /api/attachments/{id}:
 *   put:
 *     summary: Update the filename of an attachment
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the attachment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFileNameDTO'
 *     responses:
 *       200:
 *         description: Attachment filename updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttachmentDTO'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Attachment not found
 */
router.put(
  '/:id',
  authMiddleware,
  (req, res, next) => attachmentController.updateFileName(req, res, next)
);

/**
 * @swagger
 * /api/attachments/share:
 *   post:
 *     summary: Share an attachment with other users
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShareFileDTO'
 *     responses:
 *       200:
 *         description: Attachment shared successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Attachment or users not found
 */
router.post(
  '/share',
  authMiddleware,
  (req, res, next) => attachmentController.shareFile(req, res, next)
);

/**
 * @swagger
 * /api/attachments/download/{id}:
 *   get:
 *     summary: Download an attachment by ID
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the attachment to download
 *     responses:
 *       200:
 *         description: Attachment downloaded successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Attachment not found
 */
router.get(
  '/download/:id',
  authMiddleware,
  (req, res, next) => attachmentController.downloadAttachment(req, res, next)
);


export default router;
