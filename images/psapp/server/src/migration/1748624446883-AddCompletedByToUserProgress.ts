import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompletedByToUserProgress1748624446883 implements MigrationInterface {
    name = 'AddCompletedByToUserProgress1748624446883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_progress" ADD "completed_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_completed_by_id" FOREIGN KEY ("completed_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_user_progress_completed_by_id"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP COLUMN "completed_by_id"`);
    }

}
