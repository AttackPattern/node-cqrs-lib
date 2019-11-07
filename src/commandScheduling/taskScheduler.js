import Identity from '../auth/identity';
import Schedule from './schedule';
import CommandFailure, { Retry } from './commandFailure';
import { v2beta3 } from '@google-cloud/tasks';

export default class TaskScheduler {

  /**
  * Google cloud Tasks scheduler.  Takes a command and sends it to the cloud for later execution
  * https://cloud.google.com/tasks/docs/creating-http-target-tasks
  * @param Object credentials - the private_key, client_email and email values to use
  * @param String deliveryPath - the path of the url to be delivered to
  * @param String location - gcloud task que dc location
  * @param String project - the gcloud project the task scheudler is in
  * @param String queue - the name of the queue (unique for dev/staging/production)
  * @param String rootUrl - the rootUrl for the callback.  it varies specifically for dev as
  * the dev environment needs to create a dynamic proxy tunnel into the local network using ngrok
  **/
  constructor({ credentials, deliveryPath, location = 'us-central1', project, queue, rootUrl }) {
    this.project = project;
    this.queue = queue;
    this.location = location;
    this.deliveryUrl = `${rootUrl}/${deliveryPath}`;
    this.client = new v2beta3.CloudTasksClient({ credentials });

  }

  schedule = async ({ aggregate, service, target, seconds, command }) => {
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service || aggregate,
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
    const [response] = await this.client.createTask({ parent, task });
    console.log('created gcloud task');
    }
    catch (ex) {
      console.error('Error creating Gcloud Task', ex);
    }
  }
}
