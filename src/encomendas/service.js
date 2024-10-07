import Mailer from '../../pkg/mail/nodemailer.js';
import { v4 as uuidv4 } from 'uuid';

export default class Service {
    async ProduceMessage(producer, topic, message) {
        await producer.connect()
        await producer.send({
            topic: topic,
            messages: [
                { value: JSON.stringify(message) }
            ]
        }); 
    }

    async StartFluxo(producer, statusPgto, prodOk, codRastreio) {
        await statusPgto.connect()
        await prodOk.connect()
        await codRastreio.connect()
    
        await statusPgto.subscribe({
            topic: 'status_pgto',
            fromBeginning: true,
        })
    
        await prodOk.subscribe({
            topic: 'prod_ok',
            fromBeginning: true,
        })
    
        await codRastreio.subscribe({
            topic: 'cod_rastreio',
            fromBeginning: true,
        })

        await statusPgto.run({
            eachMessage: async ({ topic, partition, message }) => {
                var msg = JSON.parse(message.value.toString())
                if (msg.tipo == "1") {
                    await this.ProduceMessage(producer, 'dispara_prd', {
                        "id_encomenda": uuidv4()    
                    })
                } 
                return;  
            }
        })

        await prodOk.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log("Received message from prod_ok topic:", message.value.toString())
                var msg = JSON.parse(message.value.toString())
                if(msg.status) {
                    await this.ProduceMessage(producer, 'req_envio', {
                        "tipo": 1,
                        "id_encomenda": msg.id_encomenda
                    })
                } else {
                    return;
                }
                
            }
        })

        await codRastreio.run({
            eachMessage: async ({ topic, partition, message }) => {
                var msg = JSON.parse(message.value.toString())
                if (msg.tipo == 1) {
                    const mailer = new Mailer()
                    mailer.SendEmail("limaa.diogi@gmail.com", "oi", msg.id_encomenda)
                }
                console.log("Received message from cod_rastreio topic:", message.value.toString())
            }
        })
    }
    

}
