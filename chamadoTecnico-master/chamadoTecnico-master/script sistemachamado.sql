CREATE DATABASE sistemaGestaoChamadosTecnicos;

USE sistemaGestaoChamadosTecnicos;

CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    tipo VARCHAR(15) NOT NULL
);

CREATE TABLE Chamado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(30) NOT NULL,
    descricao VARCHAR(700) NOT NULL,
    stats VARCHAR(15) NOT NULL,
    prioridade VARCHAR(10) NOT NULL,
    data_criacao DATE DEFAULT (CURRENT_DATE),
    data_conclusao DATE,
    tecnico_id INT NOT NULL,
    fk_Usuario_id INT NOT NULL,
    fk_Categoria_id INT NOT NULL
);

CREATE TABLE Categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(25) NOT NULL
);
 
ALTER TABLE Chamado ADD CONSTRAINT FK_Chamado_2
    FOREIGN KEY (fk_Usuario_id)
    REFERENCES Usuario (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
 
ALTER TABLE Chamado ADD CONSTRAINT FK_Chamado_3
    FOREIGN KEY (fk_Categoria_id)
    REFERENCES Categoria (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;