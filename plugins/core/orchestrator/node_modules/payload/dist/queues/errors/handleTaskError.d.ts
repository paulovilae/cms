import type { PayloadRequest } from '../../index.js';
import type { UpdateJobFunction } from '../operations/runJobs/runJob/getUpdateJobFunction.js';
import type { TaskError } from './index.js';
export declare function handleTaskError({ error, req, updateJob, }: {
    error: TaskError;
    req: PayloadRequest;
    updateJob: UpdateJobFunction;
}): Promise<{
    hasFinalError: boolean;
}>;
//# sourceMappingURL=handleTaskError.d.ts.map