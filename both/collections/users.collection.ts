import { MongoObservable } from 'meteor-rxjs';

import { PipeUser } from '../models/user.model';

export const PipeUsers = new MongoObservable.Collection<PipeUser>('pipeUsers', {idGeneration: 'MONGO'});


