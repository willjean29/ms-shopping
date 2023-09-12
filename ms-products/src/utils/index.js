const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Kafka } = require('kafkajs');

const { APP_SECRET } = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// Message Broker

module.exports.Broker = () => {
  const kafka = new Kafka({
    clientId: 'ms-products',
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
  });
  const producer = kafka.producer();
  return { kafka, producer };
}

module.exports.PublishMessage = async (producer, topic, message) => {
  try {
    console.log({ topic, message })
    await producer.connect()
    await producer.send({
      topic: topic,
      messages: [
        { value: JSON.stringify(message) },
      ],
    })
    await producer.disconnect()
  } catch (err) {
    throw err;
  }
}

module.exports.SuscribeMessage = async (kafka, topics) => {
  try {
    const consumer = kafka.consumer({ groupId: 'ms-products-consumer' })

    await consumer.connect()
    await consumer.subscribe({ topics, fromBeginning: true })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          value: message.value.toString(),
        })
      },
    })
  } catch (err) {
    throw err;
  }
}

module.exports.PublishCustomerEvent = async (producer, topic, message) => {
  axios.post('http://localhost:8000/customer/app-events', {
    payload
  })
}

module.exports.PublishShoppingEvent = async (payload) => {
  axios.post('http://localhost:8000/shopping/app-events', {
    payload
  })
}
