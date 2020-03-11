# Tarea 1. SQL Avanzado

---

##### Integrantes:
1. *[Salomon Levy Becherano]* - *[A01023530]* - *[CSF]*
2. *[Luis Antonio García]* - *[A01021865]* - *[CSF]*
2. *[Luis Ortiz Revilla]* - *[A01022320]* - *[CSF]*
2. *[Sebastián Vives Faus]* - *[A01025211]* - *[CSF]*

---
## 1. Aspectos generales

Las orientaciones de la tarea se encuentran disponibles en la plataforma **Canvas**.

Este documento es una guía sobre qué información debe entregar como parte de la tarea, qué requerimientos técnicos debe cumplir y la estructura que debe seguir para organizar su entrega.


### 1.1 Requerimientos técnicos

A continuación se mencionan los requerimientos técnicos mínimos de la tarea, favor de tenerlos presente para que cumpla con todos.

* El equipo tiene la libertad de elegir las tecnologías de desarrollo a utilizar en la tarea, sin embargo, debe tener presente que la solución final se deberá ejecutar en una plataforma en la nube. Puede ser  [Google Cloud Platform](https://cloud.google.com/?hl=es), [Azure](https://azure.microsoft.com/en-us/), AWS [AWS](https://aws.amazon.com/es/free/) u otra.
* El equipo tiene la libertad de utilizar el DBMS de su preferencia.
* La arquitectura de la solución deberá estar separada claramente por capas (*frontend*, *backend*, datos y almacenamiento).
* Todo el código, *scripts* y la documentación de la tarea debe alojarse en este repositorio de GitHub, siguiendo la estructura que aparece a continuación.

### 1.2 Estructura del repositorio

El proyecto debe seguir la siguiente estructura de carpetas:
```
- / 			        # Raíz de toda la tarea
    - README.md			# Archivo con la información general de la tarea (este archivo)
    - frontend			# Carpeta con la solución del frontend (Web app)
    - backend			# Carpeta con la solución del backend en caso de ser necesario (CMS o API)
    - scripts		        # Carpeta con los scripts necesarios para generar la base de datos, cargar datos y ejecutar las consultas
    - database			# Carpeta con el diagrama Entidad-Relación Extendido y los archivos CSV de datos necesarios para generar la bases de datos

```

### 1.3 Documentación de la tarea

Como parte de la entrega de la tarea, se debe incluir la siguiente información:

* Diagrama del *Modelo Entidad-Relación Extendido*.
* *Scripts* para generar la base de datos, cargar datos y ejecutar consultas.
* Archivos CSV con los datos a cargar en al base de datos.
* Guía de configuración, instalación y despliegue de la aplicación en la plataforma en la nube  seleccionada.
* El código debe estar documentado siguiendo los estándares definidos para el lenguaje de programación seleccionado.

## 2. Solución

A continuación aparecen descritos los diferentes elementos que forman parte de la solución de la tarea.

### 2.1 Modelo de la *base de datos* 
https://www.lucidchart.com/invitations/accept/100f313d-7118-4d3c-be17-27a5cb181f71

[Modelo EER](https://github.com/tec-csf/tc3041-t1-primavera-2020-equipo6/blob/SQL_Atemporal/database/EER.png)

[Jerarquías] 
Usamos esta estructura ya que para realizar elecciones ya que se cuenta con un colegio, cada colegio tendra cierto numero de mesas. Las mesas llevaran la cuenta de votos nulos y votos vacios, luego tenemos la tabla de partido la cual se encargará de los datos de sigla, nombre del partido y del presidente. De la tabla partido sale la tabla de lista nominal. También esta la tabla de votantes la cual nos dirá a partir de booleanos si el votante es mexicano, si es apoderado y que tipo de votacion fue si municipal o federal. De esta tabla sale si el votante es miembro o suplente de una mesa.

### 2.2 Arquitectura de la solución

[Modelo UML](https://github.com/tec-csf/tc3041-t1-primavera-2020-equipo6/blob/SQL_Atemporal/database/UML.png)

### 2.3 Frontend

*[Incluya aquí una explicación de la solución utilizada para el frontend de la tarea. No olvide incluir las ligas o referencias donde se puede encontrar información de los lenguajes de programación, frameworks y librerías utilizadas.]*

#### 2.3.1 Lenguaje de programación
Programado en Angular.ts, que es Typescript (parecido a Javascript)
#### 2.3.2 Framework
Angular.ts
#### 2.3.3 Librerías de funciones o dependencias
import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoadDataComponent } from './load-data/load-data.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';

### 2.4 Backend
El backend de la aplicacion se encuentra principalmente en el archivo server.js, donde, utilizando el archivo .env en donde esta la conexion a la BD en Docker, obtenemos la informacion de la BD de cada tabla con funciones GET. Tambien, se encuentran nuestras funciones db2 de insert, update y delete de cada tabla.

#### 2.4.1 Lenguaje de programación
Programado en Node.js, que es Javascript.
#### 2.4.2 Framework
Node.js
#### 2.4.3 Librerías de funciones o dependencias
Utiliza principalmente el archivo .env para hacer las conexiones de la DB de db2 a Node.js

## 2.5 Pasos a seguir para utilizar la aplicación

#### 1. Clonar el repositorio de Github a su PC (en la carpeta que el usuario desee). 
Utilizando el comando $git clone [link del repositorio]
#### 2. Crear una instancia de IBM_DB2:
En este caso, creamos la BD localmente (Hay que tener: Una cuenta de Docker, Docker Desktop instalado e iniciar sesion en Docker Desktop).
En la carpeta deseada, abrir la terminal y correr los siguientes comandos:

docker pull ibmcom/db2

docker run -itd --name mydb2 --privileged=true -p 50000:50000 -e LICENSE=accept -e DB2INST1_PASSWORD=password -e DBNAME=[cualquier nombre] ibmcom/db2 bash

docker exec -ti mydb2 bash -c "su - db2inst1"

#### 3. Conectarse a la BD (en db2) y agregar las tablas.
Utilizando los siguientes comandos, conectese a la base de datos en el contenedor:

db2

connect to [nombre de la base de datos]

Despues, inserte todas las operaciones de creacion de tablas que se encuentran en /scripts/Comandos DB2 para generar DB.txt

Finalmente, inserte la informacion de las tablas del CSV que se encuentra en /scripts/Votaciones_data.txt

#### 4. Actualizar el archivo .env
Copia esto a tu archivo .env:

DB_DATABASE=testdb
DB_HOSTNAME=localhost
DB_PORT=50000
DB_UID=db2inst1
DB_PWD=password
DB_SCHEMA=DB2ADB

#### 5. Corre la aplicacion.
Si no tienes instalado NPM ni YARN, utiliza los comandos en la terminal dentro de la carpeta donde esta la aplicacion:
npm install
yarn install

En otra terminal, corre los comandos: 
ng serve --open
node server.js

Finalmente, en un buscador (cualquiera), ingresa a la direccion http://localhost:8888 y listo!

## 3. Referencias
#### Pagina donde creamos el diagrama EER.
https://www.lucidchart.com/

#### Pagina donde consultamos todos los comandos de DB2.
https://www.ibm.com/support/producthub/db2/

#### Pagina donde generamos valores aleatorios para insertarlos en la BD.
https://www.generatedata.com/#t1
