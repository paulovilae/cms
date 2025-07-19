import type { Job } from '../../../../index.js';
import type { PayloadRequest } from '../../../../types/index.js';
import type { WorkflowConfig, WorkflowHandler } from '../../../config/types/workflowTypes.js';
import type { UpdateJobFunction } from './getUpdateJobFunction.js';
type Args = {
    job: Job;
    req: PayloadRequest;
    updateJob: UpdateJobFunction;
    workflowConfig: WorkflowConfig;
    workflowHandler: WorkflowHandler;
};
export type JobRunStatus = 'error' | 'error-reached-max-retries' | 'success';
export type RunJobResult = {
    status: JobRunStatus;
};
export declare const runJob: ({ job, req, updateJob, workflowConfig, workflowHandler, }: Args) => Promise<RunJobResult>;
export {};
//# sourceMappingURL=index.d.ts.map