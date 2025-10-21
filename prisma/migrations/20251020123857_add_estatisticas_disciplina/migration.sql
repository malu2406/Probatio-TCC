-- DropForeignKey
ALTER TABLE `estatisticas` DROP FOREIGN KEY `Estatisticas_userId_fkey`;

-- CreateTable
CREATE TABLE `estatisticas_disciplina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `materia` VARCHAR(191) NOT NULL,
    `disciplina` VARCHAR(191) NOT NULL,
    `total` INTEGER NOT NULL DEFAULT 0,
    `acertos` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `estatisticas_disciplina_userId_materia_disciplina_key`(`userId`, `materia`, `disciplina`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `estatisticas` ADD CONSTRAINT `estatisticas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estatisticas_disciplina` ADD CONSTRAINT `estatisticas_disciplina_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `estatisticas_userId_materia_key` ON `estatisticas`(`userId`, `materia`);
DROP INDEX `Estatisticas_userId_materia_key` ON `estatisticas`;
