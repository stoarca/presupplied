import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1695011145500 implements MigrationInterface {
    name = 'Initial1695011145500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "hashed" character varying NOT NULL, CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a56c051c91dbe1068ad683f536" ON "student" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a56c051c91dbe1068ad683f536"`);
        await queryRunner.query(`DROP TABLE "student"`);
    }

}
