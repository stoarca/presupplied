import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentProgress1695100380812 implements MigrationInterface {
    name = 'StudentProgress1695100380812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."student_progress_status_enum" AS ENUM('not_attempted', 'attempted', 'passed')`);
        await queryRunner.query(`CREATE TABLE "student_progress" ("id" SERIAL NOT NULL, "status" "public"."student_progress_status_enum" NOT NULL DEFAULT 'not_attempted', "student_id" integer, "module_id" integer, CONSTRAINT "PK_e7df7ebbbab37cc250594423a38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1cf5e7c110ba33d9e2f67eb2f9" ON "student_progress" ("student_id", "module_id") `);
        await queryRunner.query(`ALTER TABLE "student_progress" ADD CONSTRAINT "FK_760b6a9d017ba81f2a33b1bddee" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_progress" ADD CONSTRAINT "FK_b109d4c21740d0c62fed058f64a" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_progress" DROP CONSTRAINT "FK_b109d4c21740d0c62fed058f64a"`);
        await queryRunner.query(`ALTER TABLE "student_progress" DROP CONSTRAINT "FK_760b6a9d017ba81f2a33b1bddee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cf5e7c110ba33d9e2f67eb2f9"`);
        await queryRunner.query(`DROP TABLE "student_progress"`);
        await queryRunner.query(`DROP TYPE "public"."student_progress_status_enum"`);
    }

}
