import Identity from '../auth/identity';
import Schedule from './schedule';
import CommandFailure, { Retry } from './commandFailure';
import { v2beta3 } from '@google-cloud/tasks';

export default class TaskScheduler {

  constructor({ deliveryUrl, project, queue, location, credentials }) {
    this.project = project;
    this.queue = queue;
    this.location = location;
    this.deliveryUrl = deliveryUrl;
    this.client = new v2beta3.CloudTasksClient({credentials});

  }

  schedule = async ({ service, target, seconds, command }) => {
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service,
      target: target
    });
    const parent = this.client.queuePath(this.project, this.location, this.queue);
    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: this.deliveryUrl,
        body: Buffer.from(JSON.stringify(command)).toString('base64')
      }
    };
    if (seconds) {
      task.scheduleTime = { seconds: Date.now() / 1000 + seconds };
    }
    try {
    console.log('creating gcloud task', task);
    const [response] = await this.client.createTask({ parent, task });
    console.log('created gcloud task', response);
    }
    catch (ex) {
      console.error('Error creating Gcloud Task', ex);
    }
  }
}
