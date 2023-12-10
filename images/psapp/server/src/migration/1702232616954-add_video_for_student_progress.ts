import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVideoForStudentProgress1702232616954 implements MigrationInterface {
    name = 'AddVideoForStudentProgress1702232616954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."student_progress_video_status_enum" AS ENUM('not_watched', 'watched')`);
        await queryRunner.query(`CREATE TABLE "student_progress_video" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "video_vanity_id" character varying NOT NULL, "status" "public"."student_progress_video_status_enum" NOT NULL DEFAULT 'not_watched', "student_progress_id" integer, CONSTRAINT "PK_6fc833e37bb23a14d7b5e8541d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_470ffd4985fded33a42705975d" ON "student_progress_video" ("student_progress_id", "video_vanity_id") `);
        await queryRunner.query(`ALTER TABLE "student_progress_video" ADD CONSTRAINT "FK_e3da7f4c75bbf13705a9b7d8378" FOREIGN KEY ("student_progress_id") REFERENCES "student_progress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_progress_video" DROP CONSTRAINT "FK_e3da7f4c75bbf13705a9b7d8378"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_470ffd4985fded33a42705975d"`);
        await queryRunner.query(`DROP TABLE "student_progress_video"`);
        await queryRunner.query(`DROP TYPE "public"."student_progress_video_status_enum"`);
    }

}
