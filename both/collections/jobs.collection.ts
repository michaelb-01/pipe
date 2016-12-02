import { MongoObservable } from 'meteor-rxjs';

import { Job } from '../models/job.model';

export const Jobs = new MongoObservable.Collection<Job>('jobs', {idGeneration: 'MONGO'});