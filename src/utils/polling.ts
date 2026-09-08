export class TimeoutError extends Error {
    constructor(ms: number) {
        super(`Operation timed out after ${ms}ms`);
        this.name = "TimeoutError";
    }
}

interface PollOptions {
    intervalMs?: number;
    timeoutMs?: number;
}

export function pollUntil<T>(
    fn: () => T | null | undefined | false,
    options: PollOptions = {}
): Promise<T> {
    const {intervalMs = 100, timeoutMs = 10000} = options;

    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const timer = setInterval(() => {
            // 1. Run condition check
            const result = fn();
            if (result) {
                clearInterval(timer);
                return resolve(result);
            }

            // 2. Check for timeout
            if (Date.now() - startTime >= timeoutMs) {
                clearInterval(timer);
                return reject(new TimeoutError(timeoutMs));
            }
        }, intervalMs);
    });
}