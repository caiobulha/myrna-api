import { Kafka } from "kafkajs";

class KafkaConfig {
    constructor(clientId, brokers) {
        this.clientId = clientId;
        this.brokers = brokers;
    }

    newKafka() {
        return new Kafka({
            clientId: this.clientId,
            brokers: this.brokers
        });
    }
} 

export default KafkaConfig;
