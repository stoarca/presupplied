import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtUpdatedAtCols1696792425972 implements MigrationInterface {
    name = 'AddCreatedAtUpdatedAtCols1696792425972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "module" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student_progress" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student_progress" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "student_progress" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "student_progress" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "created_at"`);
    }

}
