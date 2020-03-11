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

var features = ['LOTAREA', 'BLDGTYPE', 'HOUSESTYLE', 'OVERALLCOND', 'YEARBUILT',
  'ROOFSTYLE', 'EXTERCOND', 'FOUNDATION', 'BSMTCOND', 'HEATING',
  'HEATINGQC', 'CENTRALAIR', 'ELECTRICAL', 'FULLBATH', 'HALFBATH',
  'BEDROOMABVGR', 'KITCHENABVGR', 'KITCHENQUAL', 'TOTRMSABVGRD',
  'FIREPLACES', 'FIREPLACEQU', 'GARAGETYPE', 'GARAGEFINISH', 'GARAGECARS',
  'GARAGECOND', 'POOLAREA', 'POOLQC', 'FENCE', 'MOSOLD', 'YRSOLD'];

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'mapquest',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'puEBOpI1vnXm8RZgz3dS5qJ7KhYQGYew', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


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

function getInsertQuery(view, obj) {
  var table = process.env.DB_SCHEMA + "." + getViewName(view);
    switch(view){
      case 0:
        return "INSERT INTO " + table + " (id, start_date, end_date) VALUES ('" + obj['id'] + "', '" + obj['startDate'] + "', '" + obj['endDate'] + "');";
      case 1:
        return "INSERT INTO " + table + " (id, colegio_id, letra, votos_vacios, votos_nulos) VALUES ('" + obj['id'] + "', '" + obj['colegioId'] + "', '" + obj['letra'] + "', '"+ obj['votosVacios'] + "', '"+ obj['votosNulos'] + "');";
      case 2:
        return "INSERT INTO " + table + " (siglas, nombre, nombre_presidente) VALUES ('" + obj['siglas'] + "', '" + obj['nombre'] + "', '" + obj['presidente'] + "');";
      case 3:
        return "INSERT INTO " + table + " (ine_pasaporte, nombre, nacimiento, direccion, mesa_id, partido_siglas, apoderado, mexicano, municipal_federal) VALUES ('" + obj['ine'] + "', '" + obj['nombre'] + "', '" + obj['nacimiento'] + "', '"+ obj['direccion'] + "', '"+ obj['mesaId'] + "', '"+ obj['partidoId'] + "', '"+ obj['apoderado'] + "', '"+ obj['mexicano'] + "', '"+ obj['municipalFederal'] + "');";
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
    var table = getViewName(request.body.view);
    var query = "SELECT * FROM " + process.env.DB_SCHEMA + "." + table + " WHERE ID=" + request.body.id + ";";
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

    var str2 = "UPDATE " + process.env.DB_SCHEMA + ".HOME_ADDRESS SET ADDRESS1='" + request.body.addressInfo.address1 + "',ADDRESS2='" + request.body.addressInfo.address2 + "',CITY='" + request.body.addressInfo.city + "',STATE='" + request.body.addressInfo.state + "',COUNTRY='" + request.body.addressInfo.country + "',ZIPCODE=" + request.body.addressInfo.zipcode + " WHERE HOME_ID=" + request.body.id + ";";

    var str4 = "INSERT INTO " + process.env.DB_SCHEMA + ".HOME_ADDRESS (ADDRESS1, ADDRESS2, CITY, STATE,ZIPCODE, COUNTRY,HOME_ID) VALUES ('" + request.body.addressInfo.address1 + "', '" + request.body.addressInfo.address2 + "', '" + request.body.addressInfo.city + "', '" + request.body.addressInfo.state + "', " + request.body.addressInfo.zipcode + ", '" + request.body.addressInfo.country + "', " + request.body.id + ");";

    var str = "UPDATE " + process.env.DB_SCHEMA + ".HOME_SALES SET LOTAREA=" + request.body.data.lotArea + ", YEARBUILT=" + request.body.data.yearBuilt + ", BLDGTYPE='" + request.body.data.bldgType + "',HOUSESTYLE='" + request.body.data.houseStyle + "',OVERALLCOND=" + request.body.data.overallCond + ",ROOFSTYLE='" + request.body.data.roofStyle + "',EXTERCOND='" + request.body.data.exterCond + "',FOUNDATION='" + request.body.data.foundation + "',BSMTCOND='" + request.body.data.bsmtCond + "',HEATING='" + request.body.data.heating + "',HEATINGQC='" + request.body.data.heatingQC + "',CENTRALAIR='" + request.body.data.centralAir + "',ELECTRICAL='" + request.body.data.electrical + "',FULLBATH=" + request.body.data.fullBath + ",HALFBATH=" + request.body.data.halfBath + ",BEDROOMABVGR=" + request.body.data.bedroomAbvGr + ",KITCHENABVGR=" + request.body.data.kitchenAbvGr + ",KITCHENQUAL='" + request.body.data.kitchenQual + "',TOTRMSABVGRD=" + request.body.data.tempotRmsAbvGrd + ",FIREPLACES=" + request.body.data.fireplaces + ",FIREPLACEQU='" + request.body.data.fireplaceQu + "',GARAGETYPE='" + request.body.data.garageType + "',GARAGEFINISH='" + request.body.data.garageFinish + "',GARAGECARS=" + request.body.data.garageCars + ",GARAGECOND='" + request.body.data.garageCond + "',POOLAREA=" + request.body.data.poolArea + ",POOLQC='" + request.body.data.poolQC + "',FENCE='" + request.body.data.fence + "',MOSOLD=" + request.body.data.moSold + ",YRSOLD=" + request.body.data.yrSold + ",SALEPRICE=" + request.body.data.salePrice + " WHERE ID=" + request.body.id + ";";

    var str3 = "SELECT * FROM " + process.env.DB_SCHEMA + ".HOME_ADDRESS WHERE HOME_ID=" + request.body.id + ";";

    conn.query(str, function (err, data) {
      if (err) {
        return response.json({ success: -2, message: err });
      }
      conn.query(str3, function (err, data2) {
        console.log(data);
        if (err) {
          return response.json({ success: -3, message: err });
        }
        else {
          if (data2.length == 0) {
            conn.query(str4, function (err, data) {
              if (err) {
                return response.json({ success: -2, message: err });
              }
              else {
                conn.close(function () {
                  return response.json({ success: 1, message: 'Data Edited!' });
                });
              }
            });
          }
          else {
            conn.query(str2, function (err, data) {
              if (err) {
                return response.json({ success: -2, message: err });
              }
              else {
                conn.close(function () {
                  return response.json({ success: 1, message: 'Data Edited!' });
                });
              }
            });
          }
        }

      });
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
