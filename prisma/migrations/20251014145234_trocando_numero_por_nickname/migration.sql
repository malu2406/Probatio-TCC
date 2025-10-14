/*
  Warnings:

  - You are about to drop the column `numero` on the `user` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `numero`,
    ADD COLUMN `nickname` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `flashcards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `materia` VARCHAR(191) NOT NULL,
    `conteudo` VARCHAR(191) NOT NULL,
    `pergunta` VARCHAR(191) NOT NULL,
    `resposta` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `flashcards` ADD CONSTRAINT `flashcards_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
