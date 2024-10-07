import express from 'express';
import dotenv from 'dotenv';
import Service from './src/encomendas/service.js';
import KafkaConfig from './pkg/kafka/kafka.js';
import { Partitioners } from 'kafkajs'
import bodyParser from 'body-parser'

dotenv.config();

const app = express()

var clientId = "application"
var brokers = ["localhost:9092"]

const kafka = new KafkaConfig(clientId, brokers).newKafka()

const service = new Service(kafka)


const producer = kafka.producer({
     allowAutoTopicCreation: true,
     createPartitioner: Partitioners.LegacyPartitioner
})

const statusPgto = kafka.consumer({groupId: "group"})
const prodOk = kafka.consumer({groupId: "group2"})
const codRastreio = kafka.consumer({groupId: "group3"})

var jsonParser = bodyParser.json()

app.post("/encomenda", jsonParser, (req, res) => {
     var body = req.body

     var produtos = body.carrinho
     var cpf = body.cpf

     var totalCompra = 0
     produtos.map((el) => totalCompra+=el.quantidade)

     var reqCobrancaReq = {
          "carrinho": produtos,
          "cpf": cpf,
          "tipo": "1",
          "total": totalCompra,
          "tipo_cobranca": body.tipo_cobranca
     }

     const req_cobranca_topic = "req_cobranca"

     service.ProduceMessage(producer, req_cobranca_topic, reqCobrancaReq)
     res.send("produto postado com sucesso!")
})


app.listen(process.env.APP_PORT, () => {
     console.log(`Service listening on port ${process.env.APP_PORT}`)
     service.StartFluxo(producer, statusPgto, prodOk, codRastreio)
})




