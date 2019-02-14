import { Record } from '../../model/Record';
import { Commit } from '../../model/Commit';

export interface Handler {
    handle(record:Record, commit:Commit);
}