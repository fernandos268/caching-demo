const kafka = require('kafka-node')
const uuid = require('uuid/v4')

module.exports = class kafka_datasource {
    constructor(props) {
        this.props = props

        this.producer = this.props.producer
        this.consumer = this.props.consumer
    }


    produce({ topic, ...payload }) {
        this.producer.on('ready', function () {
            console.log('PRODUCER IS READY')
        });

        const kafka_message = {
            topic,
            timestamp: Date.now(),
            messages: [JSON.stringify(payload)]
        }

        const producer_payloads = [kafka_message]

        this.producer.send(producer_payloads, (error, data) => {
            console.log("send -> error", error)
            console.log("send -> data", data)
        })

        // const consumer = new kafka.ConsumerGroup(consumer_options, topic)

    }

    consume() {
        return this.consumer
    }
}
