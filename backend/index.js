const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyPaser = require('body-parser')

const app = express();
let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'chatbot';
const tableName = 'chatbot';

const jsonPaser = bodyPaser.json();
const urlencondedPaser = bodyPaser.urlencoded({ extended: false });

app.use(jsonPaser);
app.use(urlencondedPaser)

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (_, client) => {
    assert.equal(null, _);
    console.log('banco de dados logado.')
    db = client.db(dbName);
})

app.listen(3000)
console.log('Servidor rodando na porta 3000.')

//routes
app.post('/insert', urlencondedPaser, async (req, res) => {
    let objJSON = await mountInsertObject(req);
    insertData(objJSON, (result) => {
        res.send(result);
    })
})

app.post('/update', urlencondedPaser, async (req, res) => {
    let objJSON = await mountJsonObjectUpdateDelete(req);
    updateData(objJSON, (result) => {
        res.send(result);
    })
})

app.post('/delete', urlencondedPaser, async (req, res) => {
    let objJSON = await mountJsonObjectUpdateDelete(req);
    deleteData(objJSON, (result) => {
        res.send(result);
    })
})


app.post('/find', urlencondedPaser, async (req, res) => {
    let objJSON = await mountJsonObjectUpdateDelete(req);
    findData(objJSON, (result) => {
        res.send(result);
    })
})

//metodos
const insertData = (objJSON, callback) => {
    const collection = db.collection(tableName);
    collection.insertOne(objJSON, (_, result) => {
        assert.equal(null, _);
        callback(result);
    });
}

const updateData = (objJSON, callback) => {
    const collection = db.collection(tableName);
    const code_current = objJSON.code_current;
    collection.updateOne({ code_current: code_current }, { $set: objJSON }, (_, result) => {
        assert.equal(null, _);
        callback(result);
    });
}

const deleteData = (objJSON, callback) => {
    const collection = db.collection(tableName);
    collection.deleteOne(objJSON, (_, result) => {
        assert.equal(null, _);
        callback(result);
    });
}

const findData = (objJSON, callback) => {
    const collection = db.collection(tableName);
    collection.find(objJSON).toArray((_, result) => {
        assert.equal(null, _);
        callback(result);
    });
}

//aux
async function mountInsertObject(req) {
    let objJSON = {};
    req.body.code_user ? objJSON.code_user = req.body.code_user : objJSON.code_user = 0;
    req.body.code_session ? objJSON.code_session = req.body.code_session : objJSON.code_session = 0;
    req.body.code_current ? objJSON.code_current = req.body.code_current : objJSON.code_current = await cod();
    req.body.code_before ? objJSON.code_before = req.body.code_before : objJSON.code_before = 0;
    req.body.input ? objJSON.input = req.body.input : objJSON.input = '';
    req.body.output ? objJSON.output = req.body.output : objJSON.output = 'Ops! Mas não entendi sua sua pergunta';
    return objJSON;
}

async function mountJsonObjectUpdateDelete(req) {
    let objJSON = {};
    req.body.code_user ? objJSON.code_user = req.body.code_user : null;
    req.body.code_current ? objJSON.code_current = req.body.code_current : null;
    req.body.code_session ? objJSON.code_session = req.body.code_session : null;
    req.body.code_before ? objJSON.code_before = req.body.code_before : null;
    req.body.input ? objJSON.input = req.body.input : null;
    req.body.output ? objJSON.output = req.body.output : null;
    return objJSON;
}

async function cod() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDay();
    const hora = data.getHours();
    const minuto = data.getMinutes();
    const segundo = data.getSeconds();
    const result = Number(ano + '' + mes + '' + dia + '' + hora + '' + minuto + '' + segundo);
    return result;
};