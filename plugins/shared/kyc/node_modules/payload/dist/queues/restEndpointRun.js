import { runJobs } from './operations/runJobs/index.js';
const configHasJobs = (config)=>{
    return Boolean(config.jobs?.tasks?.length || config.jobs?.workflows?.length);
};
/**
 * /api/payload-jobs/run endpoint
 */ export const runJobsEndpoint = {
    handler: async (req)=>{
        if (!configHasJobs(req.payload.config)) {
            return Response.json({
                message: 'No jobs to run.'
            }, {
                status: 200
            });
        }
        const accessFn = req.payload.config.jobs?.access?.run ?? (()=>true);
        const hasAccess = await accessFn({
            req
        });
        if (!hasAccess) {
            return Response.json({
                message: req.i18n.t('error:unauthorized')
            }, {
                status: 401
            });
        }
        const { allQueues, limit, queue } = req.query;
        const runJobsArgs = {
            queue,
            req,
            // We are checking access above, so we can override it here
            overrideAccess: true
        };
        if (typeof limit !== 'undefined') {
            runJobsArgs.limit = Number(limit);
        }
        if (allQueues && !(typeof allQueues === 'string' && allQueues === 'false')) {
            runJobsArgs.allQueues = true;
        }
        let noJobsRemaining = false;
        let remainingJobsFromQueried = 0;
        try {
            const result = await runJobs(runJobsArgs);
            noJobsRemaining = !!result.noJobsRemaining;
            remainingJobsFromQueried = result.remainingJobsFromQueried;
        } catch (err) {
            req.payload.logger.error({
                err,
                msg: 'There was an error running jobs:',
                queue: runJobsArgs.queue
            });
            return Response.json({
                message: req.i18n.t('error:unknown'),
                noJobsRemaining: true,
                remainingJobsFromQueried
            }, {
                status: 500
            });
        }
        return Response.json({
            message: req.i18n.t('general:success'),
            noJobsRemaining,
            remainingJobsFromQueried
        }, {
            status: 200
        });
    },
    method: 'get',
    path: '/run'
};

//# sourceMappingURL=restEndpointRun.js.map