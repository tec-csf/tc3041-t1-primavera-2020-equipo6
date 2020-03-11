//Server for API call to database


require('dotenv').config()
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const ibmdb = require('ibm_db');
const async = require('async');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var cors = require('cors')

app.use(cors())

let connStr = "DATABASE=" + process.env.DB_DATABASE + ";HOSTNAME=" + process.env.DB_HOSTNAME + ";PORT=" + process.env.DB_PORT + ";PROTOCOL=TCPIP;UID=" + process.env.DB_UID + ";PWD=" + process.env.DB_PWD + ";";

app.post('/newDataEntry', function (request, response) {
  var content = JSON.parse(request.body['content']);

  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      return response.json({ success: -1, message: err });
    }

    var str = getInsertQuery(request.body['view'], content);
    console.log(str);
    conn.query(str, function (err, data) {
      if (err) {
        return response.json({ success: -2, message: err });
      }
      else {
        conn.close(function () {
          return response.json({ success: 1, message: 'Data Entered!' });
        });
      }
    });
  });

})

function getViewName(view) {
  return (function (currView) {
    switch (currView) {
      case 0:
        return "COLEGIO";
      case 1:
        return "MESA";
      case 2:
        return "PARTIDO";
      case 3:
        return "VOTANTE";
      case 4:
        return "SUPLENTE";
      case 5:
        return "MIEMBRO";
      case 6:
        return "LISTA_NOMINAL";
      default:
        return "";
    }
  })(view);
}

function getUpdateQuery(view, obj, id) {
  var table = process.env.DB_SCHEMA + "." + getViewName(view);
  switch (view) {
    case 0:
      return "UPDATE " + table + " SET start_date='" + obj['startDate'] + "', end_date='" + obj['endDate'] + "' WHERE id='" + id + "';";
    case 1:
      return "UPDATE " + table + " SET colegio_id='" + obj['colegioId'] + "', letra='" + obj['letra'] + "', votos_vacios='" + obj['votosVacios'] + "', votos_nulos='" + obj['votosNulos'] + "' WHERE id='" + id + "';";
    case 2:
      return "UPDATE " + table + " SET nombre='" + obj['nombre'] + "', nombre_presidente='" + obj['presidente'] + "' WHERE siglas='" + id + "';";
    case 3:
      return "UPDATE " + table + " SET nombre='" + obj['nombre'] + "', nacimiento='" + obj['nacimiento'] + "', direccion='" + obj['direccion'] + "', mesa_id='" + obj['mesaId'] + "', partido_siglas='" + obj['partidoId'] + "', apoderado='" + obj['apoderado'] + "', mexicano='" + obj['mexicano'] + "', municipal_federal='" + obj['municipalFederal'] + "' WHERE ine_pasaporte='" + id + "';";
    case 4:
      return "UPDATE " + table + " SET votante_mesa_id='" + obj['mesaId'] + "', votante_partido_siglas='" + obj['partidoId'] + "', start_date='" + obj['startDate'] + "', end_date='" + obj['endDate'] + "' WHERE suplente_ine='" + id + "';";
    case 5:
      return "UPDATE " + table + " SET votante_ine='" + obj['votanteId'] + "', votante_mesa_id='" + obj['mesaId'] + "', votante_partido_siglas='" + obj['partidoId'] + "', presidente_vocal='" + obj['presidenteVocal'] + "', start_date='" + obj['startDate'] + "', end_date='" + obj['endDate'] + "' WHERE suplente_ine='" + id + "';";
    case 6:
      return "UPDATE " + table + " SET nombre='" + obj['nombre'] + "', partido_siglas='" + obj['partidoId'] + "', orden='" + obj['orden'] + "', start_date='" + obj['startDate'] + "', end_date='" + obj['endDate'] + "' WHERE ine='" + id + "';";
    default:
      return "";
  }
}

function getInsertQuery(view, obj) {
  var table = process.env.DB_SCHEMA + "." + getViewName(view);
  switch (view) {
    case 0:
      return "INSERT INTO " + table + " (id, start_date, end_date) VALUES ('" + obj['id'] + "', '" + obj['startDate'] + "', '" + obj['endDate'] + "');";
    case 1:
      return "INSERT INTO " + table + " (id, colegio_id, letra, votos_vacios, votos_nulos) VALUES ('" + obj['id'] + "', '" + obj['colegioId'] + "', '" + obj['letra'] + "', '" + obj['votosVacios'] + "', '" + obj['votosNulos'] + "');";
    case 2:
      return "INSERT INTO " + table + " (siglas, nombre, nombre_presidente) VALUES ('" + obj['siglas'] + "', '" + obj['nombre'] + "', '" + obj['presidente'] + "');";
    case 3:
      return "INSERT INTO " + table + " (ine_pasaporte, nombre, nacimiento, direccion, mesa_id, partido_siglas, apoderado, mexicano, municipal_federal) VALUES ('" + obj['ine'] + "', '" + obj['nombre'] + "', '" + obj['nacimiento'] + "', '" + obj['direccion'] + "', '" + obj['mesaId'] + "', '" + obj['partidoId'] + "', '" + obj['apoderado'] + "', '" + obj['mexicano'] + "', '" + obj['municipalFederal'] + "');";
    case 4:
      return "INSERT INTO " + table + " (suplente_ine, votante_mesa_id, votante_partido_siglas, start_date, end_date) VALUES ('" + obj['votanteId'] + "', '" + obj['mesaId'] + "', '" + obj['partidoId'] + "', '" + obj['startDate'] + "', '" + obj['endDate'] + "');";
    case 5:
      return "INSERT INTO " + table + " (votante_ine, votante_mesa_id, votante_partido_siglas, presidente_vocal, suplente_ine, start_date, end_date) VALUES ('" + obj['votanteId'] + "', '" + obj['mesaId'] + "', '" + obj['partidoId'] + "', '" + obj['presidenteVocal'] + "', '" + obj['suplenteIne'] + "', '" + obj['startDate'] + "', '" + obj['endDate'] + "');";
    case 6:
      return "INSERT INTO " + table + " (ine, nombre, partido_siglas, orden, start_date, end_date) VALUES ('" + obj['ine'] + "', '" + obj['nombre'] + "', '" + obj['partidoId'] + "', '" + obj['orden'] + "', '" + obj['startDate'] + "', '" + obj['endDate'] + "');";
    default:
      return "";
  }
}

function getIds(view) {
  switch (view) {
    case 0: return "ID";
    case 1: return "ID";
    case 2: return "SIGLAS";
    case 3: return "INE_PASAPORTE";
    case 4: return "SUPLENTE_INE";
    case 5: return "SUPLENTE_INE";
    case 6: return "INE";
    default: return "";
  }
}

app.post('/getData', function (request, response) {
  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      return response.json({ success: -1, message: err });
    }

    var table = getViewName(request.body.view);

    var selectQuery = "SELECT * FROM " + process.env.DB_SCHEMA + "." + table + " LIMIT " + request.body.num + ";";

    conn.query(selectQuery, function (err, data) {
      if (err) {
        return response.json({ success: -1, message: err });
      }
      conn.close(function () {
        return response.json({ success: 1, message: 'Data Received!', data: data });
      });
    });
  });
})

app.post('/getUniqueData', function (request, response) {
  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      return response.json({ success: -1, message: err });
    }
    var idName = getIds(request.body['view']);
    var table = process.env.DB_SCHEMA + "." + getViewName(request.body['view']);
    var query = "SELECT * FROM " + table + " WHERE " + idName + "='" + request.body['id'] + "';";
    console.log(query);

    conn.query(query, function (err, data) {
      if (err) {
        return response.json({ success: -2, message: err });
      }
      conn.close(function () {
        console.log(data);
        if (data.length == 0) {
          //data2[0] = { 'ADDRESS1': '', 'ADDRESS2': '', 'CITY': '', 'STATE': '', 'COUNTRY': '', 'ZIPCODE': '', 'HOME_ID': data[0]['ID'] };
          console.log(data);
        }

        return response.json({ success: 1, message: 'Data Received!', data: data });
      });
    });
  });
})

app.post('/updateDataEntry', function (request, response) {
  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      return response.json({ success: -1, message: err });
    }

    var content = JSON.parse(request.body['content']);

    var query = getUpdateQuery(request.body['view'], content, request.body['id']);
    console.log(query);

    conn.query(query, function (err, data) {
      if (err) {
        return response.json({ success: -2, message: err });
      }
      else {
        conn.close(function () {
          return response.json({ success: 1, message: 'Data Edited!' });
        });
      }
    });
  });
})


app.post('/deleteData', function (request, response) {
  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      return response.json({ success: -1, message: err });
    }
    conn.query("DELETE FROM " + process.env.DB_SCHEMA + ".HOME_SALES WHERE ID=" + request.body.id + ";", function (err, data) {
      if (err) {
        return response.json({ success: -2, message: err });
      }
      else {
        conn.query(" DELETE FROM " + process.env.DB_SCHEMA + ".HOME_ADDRESS WHERE HOME_ID=" + request.body.id + ";", function (err, data) {
          if (err) {
            return response.json({ success: -3, message: err });
          }
          conn.close(function () {
            return response.json({ success: 1, message: 'Data Deleted!' });
          });
        });
      }
    });
  });
})

app.listen(8888, function () {
  console.log("Server is listening on port 8888");
})
