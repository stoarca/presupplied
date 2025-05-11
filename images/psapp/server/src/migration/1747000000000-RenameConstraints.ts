import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameConstraints1747000000000 implements MigrationInterface {
  name = 'RenameConstraints1747000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_user_progress_user"`);
    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_b109d4c21740d0c62fed058f64a"`);
    await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "FK_user_progress_video_user_progress"`);
    await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_adult"`);
    await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_child"`);

    await queryRunner.query(`ALTER TABLE "migrations" DROP CONSTRAINT "PK_8c82d7f526340ab734260ea46be"`);
    await queryRunner.query(`ALTER TABLE "migrations" ADD CONSTRAINT "PK_migrations" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_3d8016e1cb58429474a3c041904"`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_user" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "PK_0e20d657f968b051e674fbe3117"`);
    await queryRunner.query(`ALTER TABLE "module" ADD CONSTRAINT "PK_module" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "PK_e7df7ebbbab37cc250594423a38"`);
    await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "PK_user_progress" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "PK_6fc833e37bb23a14d7b5e8541d5"`);
    await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "PK_user_progress_video" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_module_id" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "FK_user_progress_video_user_progress_id" FOREIGN KEY ("user_progress_id") REFERENCES "user_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_adult_id" FOREIGN KEY ("adult_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_child_id" FOREIGN KEY ("child_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    await queryRunner.query(`DROP INDEX "IDX_3e7b22e6876b810eac4bcfae3c"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_module_vanity_id" ON "module" ("vanity_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_module_vanity_id"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3e7b22e6876b810eac4bcfae3c" ON "module" ("vanity_id")`);

    await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_child_id"`);
    await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_adult_id"`);
    await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "FK_user_progress_video_user_progress_id"`);
    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_user_progress_user_id"`);
    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_user_progress_module_id"`);

    await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "PK_user_progress_video"`);
    await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "PK_6fc833e37bb23a14d7b5e8541d5" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "PK_user_progress"`);
    await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "PK_e7df7ebbbab37cc250594423a38" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "PK_module"`);
    await queryRunner.query(`ALTER TABLE "module" ADD CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_user"`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "migrations" DROP CONSTRAINT "PK_migrations"`);
    await queryRunner.query(`ALTER TABLE "migrations" ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_child" FOREIGN KEY ("child_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_adult" FOREIGN KEY ("adult_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "FK_user_progress_video_user_progress" FOREIGN KEY ("user_progress_id") REFERENCES "user_progress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_b109d4c21740d0c62fed058f64a" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}