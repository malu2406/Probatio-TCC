/*
  Warnings:

  - You are about to drop the `disciplina` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subcategoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subdisciplina` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `questao` DROP FOREIGN KEY `Questao_disciplinaId_fkey`;

-- DropForeignKey
ALTER TABLE `questao` DROP FOREIGN KEY `Questao_subcategoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `questao` DROP FOREIGN KEY `Questao_subdisciplinaId_fkey`;

-- DropForeignKey
ALTER TABLE `subcategoria` DROP FOREIGN KEY `Subcategoria_subdisciplinaId_fkey`;

-- DropForeignKey
ALTER TABLE `subdisciplina` DROP FOREIGN KEY `Subdisciplina_disciplinaId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `tipo` ENUM('ADMIN', 'BOLSISTA', 'USUARIO') NOT NULL DEFAULT 'USUARIO';

-- DropTable
DROP TABLE `disciplina`;

-- DropTable
DROP TABLE `questao`;

-- DropTable
DROP TABLE `subcategoria`;

-- DropTable
DROP TABLE `subdisciplina`;
