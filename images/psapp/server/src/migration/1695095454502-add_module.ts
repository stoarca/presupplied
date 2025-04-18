import { MigrationInterface, QueryRunner } from "typeorm";

export class AddModule1695095454502 implements MigrationInterface {
    name = 'AddModule1695095454502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "module" ("id" SERIAL NOT NULL, "vanity_id" character varying NOT NULL, CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3e7b22e6876b810eac4bcfae3c" ON "module" ("vanity_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3e7b22e6876b810eac4bcfae3c"`);
        await queryRunner.query(`DROP TABLE "module"`);
    }

}
