import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1725662251708 implements MigrationInterface {
    name = 'InitialMigration1725662251708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(` CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedDate" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedBy" character varying, "deleteDate" TIMESTAMP, "fileName" character varying NOT NULL, "fileKey" character varying NOT NULL, "s3Url" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedDate" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedBy" character varying, "deleteDate" TIMESTAMP, "userName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "received_attachments" ("attachment_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8ec9138875d991fc7f693c64a42" PRIMARY KEY ("attachment_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3b989df4c95a96451abd0f8c5" ON "received_attachments" ("attachment_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b88821605a8e6ef1e3ec2d184d" ON "received_attachments" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "attachment" ADD CONSTRAINT "FK_c32d96ba8b2bab65f5432d19a3c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "received_attachments" ADD CONSTRAINT "FK_a3b989df4c95a96451abd0f8c5c" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "received_attachments" ADD CONSTRAINT "FK_b88821605a8e6ef1e3ec2d184d6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "received_attachments" DROP CONSTRAINT "FK_b88821605a8e6ef1e3ec2d184d6"`);
        await queryRunner.query(`ALTER TABLE "received_attachments" DROP CONSTRAINT "FK_a3b989df4c95a96451abd0f8c5c"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP CONSTRAINT "FK_c32d96ba8b2bab65f5432d19a3c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b88821605a8e6ef1e3ec2d184d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3b989df4c95a96451abd0f8c5"`);
        await queryRunner.query(`DROP TABLE "received_attachments"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
    }

}
