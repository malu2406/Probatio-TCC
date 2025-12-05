/*
  Warnings:

  - You are about to drop the `historico_respostas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historico_respostas` DROP FOREIGN KEY `historico_respostas_userId_fkey`;

-- DropTable
DROP TABLE `historico_respostas`;
