const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

async function connect() {
    try {
        if (!RABBITMQ_URL) {
            console.log('RABBIT_URL not configured, skipping RabbitMQ connection');
            return;
        }
        
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.log('Failed to connect to RabbitMQ:', error.message);
        console.log('Continuing without RabbitMQ...');
    }
}

async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect();
    if (!channel) {
        console.log('RabbitMQ not available, skipping queue subscription');
        return;
    }
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message);
    });
}

async function publishToQueue(queueName, data) {
    if (!channel) await connect();
    if (!channel) {
        console.log('RabbitMQ not available, skipping message publish');
        return;
    }
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
    subscribeToQueue,
    publishToQueue,
    connect,
};