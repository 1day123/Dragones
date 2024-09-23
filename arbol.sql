
CREATE DATABASE arbol;

USE arbol;

CREATE TABLE persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);


CREATE TABLE parejas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_persona1 INT,
    id_persona2 INT,
    FOREIGN KEY (id_persona1) REFERENCES persona(id),
    FOREIGN KEY (id_persona2) REFERENCES persona(id)
);


CREATE TABLE hijos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_padre INT,
    id_hijo INT,
    FOREIGN KEY (id_padre) REFERENCES persona(id),
    FOREIGN KEY (id_hijo) REFERENCES persona(id)
);
