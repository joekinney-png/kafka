// const util = require('util');
// const setIntervalPromise = util.promisify(setInterval);

const kafkaInstance = require("./kafkaInstance");

let producer = null;
let producer2 = null;

const createProducer = async () => {
  producer = kafkaInstance.producer();
  // producer.logger().info("first producer was created!");
  await producer.connect();
  await producer.send({
    topic: "testTopic3",
    messages: [{ value: "Hello Kafkajs!", partition: 2 }],
  });
};

const createProducer2 = async () => {
  producer2 = kafkaInstance.producer();
  // producer2.logger().info("second producer was created!");
  await producer2.connect();
  await producer2.send({
    topic: "testTopic4",
    messages: [{ value: "Hello Kafkajs!" }],
  });
};

createProducer();
createProducer2();

let counter = 0;
async function createNewEvent() {
  const date = new Date();

  if (counter % 10 === 0) {
    producer.send({
      topic: "testTopic3",
      messages: [
        { value: `save to database ${counter}`, key: "2" },
        { value: `save to database2 ${counter}`, key: "1" },
      ],
    });
  } else {
    producer.send({
      topic: "testTopic4",
      messages: [{ value: date.toString() + " " + counter }],
    });
  }
  counter++;
}

setInterval(createNewEvent, 100);

module.exports = {
  producer,
  producer2,
};
