
module.exports = (producer, params) => {
    // console.log('kafka --> consume', producer);

    producer.on('ready', function () {
        console.log('PRODUCER IS READY')
    });

    console.log('getProjects: ', params)

    const payload = {
        entity: 'project',
        ...params
    }

    const kafka_message = {
        topic: 'cachedemo-query',
        timestamp: Date.now(),
        messages: [JSON.stringify(payload)]
    }

    const payloads = [kafka_message]

    producer.send(payloads, (error, data) => {
        console.log("send -> error", error)
        console.log("send -> data", data)
    })

}
