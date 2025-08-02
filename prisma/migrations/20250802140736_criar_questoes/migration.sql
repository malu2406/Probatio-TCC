/*
  Warnings:

  - Added the required column `disciplina` to the `Questao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `questao` ADD COLUMN `disciplina` VARCHAR(191) NOT NULL;
