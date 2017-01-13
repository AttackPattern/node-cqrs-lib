import { Client, HighLevelConsumer, HighLevelProducer } from 'kafka-node';

export default class EventStore {
  constructor(connectionString, clientId, topicsList, producerOptions) {
    this.client = new Client(connectionString, `${clientId}-${process.pid}`);

    this.producer = new HighLevelProducer(this.client, producerOptions);
    this.consumer = new HighLevelConsumer(this.client, topicsList);

    // NOTE: this is required for restarts as the consumer connection must be closed. for more info, see:
    //        https://www.npmjs.com/package/kafka-node#failedtorebalanceconsumererror-exception-node_exists-110
    process.on('SIGINT', this.close);
    process.on('SIGUSR2', this.close);
  }

  save = async (aggregate) => {
    await new Promise((resolve, reject) => {
      this.producer.send([{
        topic: 'shift',
        key: aggregate.cache.id,
        messages: JSON.stringify(aggregate.cache),
        attributes: 1
      }], (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }

  close = () => {
    this.consumer.close(true, () => {
      this.client.close(() => {
        process.kill(process.pid);
      });
    });
  }

}
