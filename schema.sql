-- ==========================================
-- SCHEMA PARA O BANCO DE DADOS MYSQL
-- EduFinance - Sistema de Gestão Escolar e Financeira
-- Compatível com CloudPanel e VPS Hostinger
-- ==========================================

-- Criação do Banco de Dados (opcional, já criado via CloudPanel)
-- CREATE DATABASE IF NOT EXISTS edufinance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE edufinance;

-- 1. TABELA DE ALUNOS (Students)
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `matricula` VARCHAR(50) NOT NULL UNIQUE,
  `status` ENUM('ATIVO', 'INATIVO', 'PENDENTE') DEFAULT 'ATIVO',
  `data_nascimento` DATE NOT NULL,
  `telefone` VARCHAR(20) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABELA DE TURMAS (Classes)
CREATE TABLE IF NOT EXISTS `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `serie` VARCHAR(50) NOT NULL,
  `turno` ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABELA DE VÍNCULO ALUNO-TURMA (Student Classes Relation)
CREATE TABLE IF NOT EXISTS `student_classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_student_class` (`student_id`, `class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABELA DE TRANSAÇÕES FINANCEIRAS (Financial Transactions)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NULL,
  `tipo` ENUM('RECEITA', 'DESPESA') NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `data_pagamento` DATE NULL,
  `status` ENUM('PAGO', 'PENDENTE', 'ATRASADO') DEFAULT 'PENDENTE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABELA DE NOTAS E DESEMPENHO ACADÊMICO (Grades)
CREATE TABLE IF NOT EXISTS `grades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `disciplina` VARCHAR(100) NOT NULL,
  `nota` DECIMAL(4, 2) NOT NULL,
  `faltas` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- SEED DE DADOS PARA TESTES INICIAIS (Opcional)
-- ==========================================

INSERT INTO `students` (`nome`, `email`, `matricula`, `status`, `data_nascimento`, `telefone`) VALUES
('Ana Clara J. Santos', 'ana.clara@escola.com.br', 'MAT2026001', 'ATIVO', '2010-04-12', '(11) 98765-4321'),
('Bruno M. Albuquerque', 'bruno.albuquerque@escola.com.br', 'MAT2026002', 'ATIVO', '2009-08-22', '(11) 97654-3210'),
('Carlos Eduardo Lima', 'carlos.lima@escola.com.br', 'MAT2026003', 'PENDENTE', '2011-01-05', '(11) 96543-2109'),
('Giovanna Mendes Rocha', 'giovanna.rocha@escola.com.br', 'MAT2026004', 'ATIVO', '2010-11-30', '(11) 95432-1098'),
('Leonardo Martins Costa', 'leonardo.costa@escola.com.br', 'MAT2026005', 'INATIVO', '2008-05-18', '(11) 94321-0987');

INSERT INTO `classes` (`nome`, `serie`, `turno`) VALUES
('9º Ano A - Fundamental', '9º Ano', 'MATUTINO'),
('1º Ano B - Ensino Médio', '1º Ano Médio', 'VESPERTINO'),
('3º Ano C - Ensino Médio', '3º Ano Médio', 'NOTURNO');

INSERT INTO `student_classes` (`student_id`, `class_id`) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 1),
(5, 3);

INSERT INTO `transactions` (`student_id`, `tipo`, `valor`, `descricao`, `data_vencimento`, `data_pagamento`, `status`) VALUES
(1, 'RECEITA', 850.00, 'Mensalidade Escolar - Maio / 2026', '2026-05-10', '2026-05-09', 'PAGO'),
(2, 'RECEITA', 950.00, 'Mensalidade Escolar - Maio / 2026', '2026-05-10', NULL, 'ATRASADO'),
(3, 'RECEITA', 850.00, 'Mensalidade Escolar - Maio / 2026', '2026-05-15', NULL, 'PENDENTE'),
(4, 'RECEITA', 850.00, 'Mensalidade Escolar - Maio / 2026', '2026-05-10', '2026-05-10', 'PAGO'),
(NULL, 'DESPESA', 1200.00, 'Energia Elétrica - Unidade Principal', '2026-05-25', '2026-05-18', 'PAGO'),
(NULL, 'DESPESA', 500.00, 'Manutenção do laboratório de informática', '2026-05-28', NULL, 'PENDENTE'),
(NULL, 'DESPESA', 3150.00, 'Suprimentos pedagógicos e material de escritório', '2026-05-05', '2026-05-05', 'PAGO');

INSERT INTO `grades` (`student_id`, `disciplina`, `nota`, `faltas`) VALUES
(1, 'Matemática', 8.5, 2),
(1, 'Português', 9.0, 0),
(1, 'História', 7.5, 3),
(2, 'Matemática', 6.0, 5),
(2, 'Português', 7.0, 4),
(4, 'Matemática', 9.5, 1),
(4, 'Português', 8.8, 1);
