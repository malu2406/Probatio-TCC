/*
  Warnings:

  - You are about to drop the column `disciplina` on the `questao` table. All the data in the column will be lost.
  - You are about to drop the column `materia_id` on the `questao` table. All the data in the column will be lost.
  - You are about to drop the column `subtema_id` on the `questao` table. All the data in the column will be lost.
  - Added the required column `disciplinaId` to the `Questao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `questao` DROP COLUMN `disciplina`,
    DROP COLUMN `materia_id`,
    DROP COLUMN `subtema_id`,
    ADD COLUMN `disciplinaId` INTEGER NOT NULL,
    ADD COLUMN `subdisciplinaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Disciplina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Disciplina_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subdisciplina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `disciplinaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subdisciplina` ADD CONSTRAINT `Subdisciplina_disciplinaId_fkey` FOREIGN KEY (`disciplinaId`) REFERENCES `Disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_disciplinaId_fkey` FOREIGN KEY (`disciplinaId`) REFERENCES `Disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_subdisciplinaId_fkey` FOREIGN KEY (`subdisciplinaId`) REFERENCES `Subdisciplina`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
