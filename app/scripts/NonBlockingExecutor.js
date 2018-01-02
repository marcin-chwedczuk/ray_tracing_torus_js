import { checkFunction, checkDefined } from "utils/preconditions";


export default class NonBlockingExecutor {
    constructor(
        tasksProducer, 
        taskProcessor,
        sleepBetweenTaskBatchesMiliseconds = 0) 
    {
        this._taskProducer = checkFunction(tasksProducer, "tasksProducer");
        this._taskProcessor = checkFunction(taskProcessor, "taskProcessor");

        this._callback = function() { };
        this._intervalId = null;
        this._tasks = null;

        this._sleepBetweenTaskBatchesMiliseconds = sleepBetweenTaskBatchesMiliseconds;
    }

    setDataProcessedCallback(callback) {
        this._callback = checkFunction(callback, "callback");
    }

    start() {
        if (this.isStarted()) {
            throw new Error("NonBlockingExecutor is already started.");
        }

        this._tasks = this._taskProducer();

        this._intervalId = setInterval(
            () => this._executeNextTask(), 
            this._sleepBetweenTaskBatchesMiliseconds);
    }

    cancel() {
        if (this.isStarted()) {
            clearInterval(this._intervalId);

            this._intervalId = null;
            this._tasks = null;
        }
    }

    isStarted() {
        return (this._intervalId !== null);
    }

    _executeNextTask() {
        let taskOrDone = this._tasks.next();

        if (taskOrDone.done) {
            this.cancel();
            return;
        }

        let taskResult = this._taskProcessor.call(null, taskOrDone.value);
        this._callback.call(null, taskResult);
    }
}