-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`COLEGIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`COLEGIO` (
  `ID` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE INDEX `start_date_UNIQUE` (`start_date` ASC) VISIBLE,
  UNIQUE INDEX `end_date_UNIQUE` (`end_date` ASC) VISIBLE,
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`MESA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`MESA` (
  `ID` INT NOT NULL,
  `COLEGIO_ID` INT NOT NULL,
  `VOTOS_VACIOS` INT NOT NULL,
  `VOTOS_NULOS` INT NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_MESA_COLEGIO_idx` (`COLEGIO_ID` ASC) VISIBLE,
  CONSTRAINT `fk_MESA_COLEGIO`
    FOREIGN KEY (`COLEGIO_ID`)
    REFERENCES `mydb`.`COLEGIO` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PARTIDO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`PARTIDO` (
  `SIGLAS` VARCHAR(10) NOT NULL,
  `NOMBRE` VARCHAR(45) NOT NULL,
  `NOMBRE_PRESIDENTE` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`SIGLAS`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`VOTANTE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`VOTANTE` (
  `INE/PASAPORTE` INT NOT NULL,
  `NOMBRE` VARCHAR(45) BINARY NOT NULL,
  `BIRTH` DATE NOT NULL,
  `DIRECCION` TEXT NOT NULL,
  `MESA_ID` INT NOT NULL,
  `PARTIDO_SIGLAS` VARCHAR(10) NOT NULL,
  `APODERADO` TINYINT(1) NOT NULL,
  `MEXICANO` TINYINT(1) NOT NULL,
  PRIMARY KEY (`INE/PASAPORTE`, `MESA_ID`, `PARTIDO_SIGLAS`),
  INDEX `fk_PERSONA_PARTIDO1_idx` (`PARTIDO_SIGLAS` ASC) VISIBLE,
  INDEX `fk_VOTANTE_MESA1_idx` (`MESA_ID` ASC) VISIBLE,
  CONSTRAINT `fk_PERSONA_PARTIDO1`
    FOREIGN KEY (`PARTIDO_SIGLAS`)
    REFERENCES `mydb`.`PARTIDO` (`SIGLAS`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_VOTANTE_MESA1`
    FOREIGN KEY (`MESA_ID`)
    REFERENCES `mydb`.`MESA` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`MUNICIPAL`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`MUNICIPAL` (
  `MESA_ID` INT NOT NULL,
  `PARTIDO_SIGLAS` VARCHAR(10) NOT NULL,
  `N_VOTOS` INT NOT NULL,
  PRIMARY KEY (`MESA_ID`, `PARTIDO_SIGLAS`),
  INDEX `fk_MESA_has_PARTIDO_PARTIDO1_idx` (`PARTIDO_SIGLAS` ASC) VISIBLE,
  INDEX `fk_MESA_has_PARTIDO_MESA1_idx` (`MESA_ID` ASC) VISIBLE,
  CONSTRAINT `fk_MESA_has_PARTIDO_MESA1`
    FOREIGN KEY (`MESA_ID`)
    REFERENCES `mydb`.`MESA` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MESA_has_PARTIDO_PARTIDO1`
    FOREIGN KEY (`PARTIDO_SIGLAS`)
    REFERENCES `mydb`.`PARTIDO` (`SIGLAS`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`FEDERAL`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`FEDERAL` (
  `PARTIDO_SIGLAS` VARCHAR(10) NOT NULL,
  `MESA_ID` INT NOT NULL,
  `N_VOTOS` INT NOT NULL,
  PRIMARY KEY (`PARTIDO_SIGLAS`, `MESA_ID`),
  INDEX `fk_PARTIDO_has_MESA_MESA1_idx` (`MESA_ID` ASC) VISIBLE,
  INDEX `fk_PARTIDO_has_MESA_PARTIDO1_idx` (`PARTIDO_SIGLAS` ASC) VISIBLE,
  CONSTRAINT `fk_PARTIDO_has_MESA_PARTIDO1`
    FOREIGN KEY (`PARTIDO_SIGLAS`)
    REFERENCES `mydb`.`PARTIDO` (`SIGLAS`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PARTIDO_has_MESA_MESA1`
    FOREIGN KEY (`MESA_ID`)
    REFERENCES `mydb`.`MESA` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`SUPLENTE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`SUPLENTE` (
  `SUPLENTE_INE/PASAPORTE` INT NOT NULL,
  `VOTANTE_MESA_ID` INT NOT NULL,
  `VOTANTE_PARTIDO_SIGLAS` VARCHAR(10) NOT NULL,
  INDEX `fk_SUPLENTE_VOTANTE1_idx` (`SUPLENTE_INE/PASAPORTE` ASC, `VOTANTE_MESA_ID` ASC, `VOTANTE_PARTIDO_SIGLAS` ASC) VISIBLE,
  PRIMARY KEY (`SUPLENTE_INE/PASAPORTE`),
  CONSTRAINT `fk_SUPLENTE_VOTANTE1`
    FOREIGN KEY (`SUPLENTE_INE/PASAPORTE` , `VOTANTE_MESA_ID` , `VOTANTE_PARTIDO_SIGLAS`)
    REFERENCES `mydb`.`VOTANTE` (`INE/PASAPORTE` , `MESA_ID` , `PARTIDO_SIGLAS`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`MIEMBRO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`MIEMBRO` (
  `VOTANTE_INE/PASAPORTE` INT NOT NULL,
  `VOTANTE_MESA_ID` INT NOT NULL,
  `VOTANTE_PARTIDO_SIGLAS` VARCHAR(10) NOT NULL,
  `PRESIDENTE_O_VOCAL` TINYINT(1) NOT NULL,
  `SUPLENTE_INE/PASAPORTE` INT NOT NULL,
  INDEX `fk_MIEMBRO_VOTANTE1_idx` (`VOTANTE_INE/PASAPORTE` ASC, `VOTANTE_MESA_ID` ASC, `VOTANTE_PARTIDO_SIGLAS` ASC) VISIBLE,
  PRIMARY KEY (`VOTANTE_INE/PASAPORTE`),
  INDEX `fk_MIEMBRO_SUPLENTE1_idx` (`SUPLENTE_INE/PASAPORTE` ASC) VISIBLE,
  CONSTRAINT `fk_MIEMBRO_VOTANTE1`
    FOREIGN KEY (`VOTANTE_INE/PASAPORTE` , `VOTANTE_MESA_ID` , `VOTANTE_PARTIDO_SIGLAS`)
    REFERENCES `mydb`.`VOTANTE` (`INE/PASAPORTE` , `MESA_ID` , `PARTIDO_SIGLAS`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MIEMBRO_SUPLENTE1`
    FOREIGN KEY (`SUPLENTE_INE/PASAPORTE`)
    REFERENCES `mydb`.`SUPLENTE` (`SUPLENTE_INE/PASAPORTE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`LISTA_NOMINAL`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`LISTA_NOMINAL` (
  `VOTANTE_INE/PASAPORTE` INT NOT NULL,
  `VOTANTE_MESA_ID` INT NOT NULL,
  `VOTANTE_PARTIDO_SIGLAS` VARCHAR(10) NOT NULL,
  `start_date` TIMESTAMP(12) NULL,
  `end_date` TIMESTAMP(12) NULL,
  `ORDEN` TINYINT(4) NULL,
  PRIMARY KEY (`VOTANTE_INE/PASAPORTE`, `VOTANTE_MESA_ID`, `VOTANTE_PARTIDO_SIGLAS`),
  CONSTRAINT `fk_LISTA_NOMINAL_VOTANTE1`
    FOREIGN KEY (`VOTANTE_INE/PASAPORTE` , `VOTANTE_MESA_ID` , `VOTANTE_PARTIDO_SIGLAS`)
    REFERENCES `mydb`.`VOTANTE` (`INE/PASAPORTE` , `MESA_ID` , `PARTIDO_SIGLAS`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
