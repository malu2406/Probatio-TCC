-- AlterTable
ALTER TABLE `questao` ADD COLUMN `subcategoriaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Subcategoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `subdisciplinaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subcategoria` ADD CONSTRAINT `Subcategoria_subdisciplinaId_fkey` FOREIGN KEY (`subdisciplinaId`) REFERENCES `Subdisciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_subcategoriaId_fkey` FOREIGN KEY (`subcategoriaId`) REFERENCES `Subcategoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
