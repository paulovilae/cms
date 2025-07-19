import type { RunningJobFromTask } from './config/types/workflowTypes.js';
import { type Job, type Payload, type PayloadRequest, type Sort, type TypedJobs, type Where } from '../index.js';
import { runJobs } from './operations/runJobs/index.js';
export declare const getJobsLocalAPI: (payload: Payload) => {
    queue: <TTaskOrWorkflowSlug extends keyof TypedJobs["tasks"] | keyof TypedJobs["workflows"]>(args: {
        input: TypedJobs["tasks"][TTaskOrWorkflowSlug]["input"];
        queue?: string;
        req?: PayloadRequest;
        task: TTaskOrWorkflowSlug extends keyof TypedJobs["tasks"] ? TTaskOrWorkflowSlug : never;
        waitUntil?: Date;
        workflow?: never;
    } | {
        input: TypedJobs["workflows"][TTaskOrWorkflowSlug]["input"];
        queue?: string;
        req?: PayloadRequest;
        task?: never;
        waitUntil?: Date;
        workflow: TTaskOrWorkflowSlug extends keyof TypedJobs["workflows"] ? TTaskOrWorkflowSlug : never;
    }) => Promise<TTaskOrWorkflowSlug extends keyof TypedJobs["workflows"] ? Job<TTaskOrWorkflowSlug> : RunningJobFromTask<TTaskOrWorkflowSlug>>;
    run: (args?: {
        /**
         * If you want to run jobs from all queues, set this to true.
         * If you set this to true, the `queue` property will be ignored.
         *
         * @default false
         */
        allQueues?: boolean;
        /**
         * The maximum number of jobs to run in this invocation
         *
         * @default 10
         */
        limit?: number;
        overrideAccess?: boolean;
        /**
         * Adjust the job processing order using a Payload sort string.
         *
         * FIFO would equal `createdAt` and LIFO would equal `-createdAt`.
         */
        processingOrder?: Sort;
        /**
         * If you want to run jobs from a specific queue, set this to the queue name.
         *
         * @default jobs from the `default` queue will be executed.
         */
        queue?: string;
        req?: PayloadRequest;
        /**
         * By default, jobs are run in parallel.
         * If you want to run them in sequence, set this to true.
         */
        sequential?: boolean;
        where?: Where;
    }) => Promise<ReturnType<typeof runJobs>>;
    runByID: (args: {
        id: number | string;
        overrideAccess?: boolean;
        req?: PayloadRequest;
    }) => Promise<ReturnType<typeof runJobs>>;
    cancel: (args: {
        overrideAccess?: boolean;
        queue?: string;
        req?: PayloadRequest;
        where: Where;
    }) => Promise<void>;
    cancelByID: (args: {
        id: number | string;
        overrideAccess?: boolean;
        req?: PayloadRequest;
    }) => Promise<void>;
};
//# sourceMappingURL=localAPI.d.ts.map