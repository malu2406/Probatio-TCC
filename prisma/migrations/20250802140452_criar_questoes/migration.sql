-- CreateTable
CREATE TABLE `Questao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `enunciado` VARCHAR(191) NOT NULL,
    `alternativa_a` VARCHAR(191) NOT NULL,
    `alternativa_b` VARCHAR(191) NOT NULL,
    `alternativa_c` VARCHAR(191) NOT NULL,
    `alternativa_d` VARCHAR(191) NOT NULL,
    `alternativa_e` VARCHAR(191) NOT NULL,
    `resposta_correta` VARCHAR(191) NOT NULL,
    `ano` INTEGER NOT NULL,
    `subtema_id` INTEGER NULL,
    `materia_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
