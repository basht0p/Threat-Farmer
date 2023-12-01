export default class RequestStats {
    private requestCount: number = 0;
    private lastUpdated: Date;
    private totalRequestsSinceLastUpdate: number = 0;

    constructor() {
        this.lastUpdated = new Date();
    }

    // Function to be called on each request
    public recordRequest(): void {
        this.requestCount++;
        this.totalRequestsSinceLastUpdate++;
    }

    // Function to get the total requests since last update
    public getRequestCountSinceLastUpdate(): number {
        return this.totalRequestsSinceLastUpdate;
    }

    // Function to calculate average requests per second
    public getAverageRequestsPerSecond(): number {
        const now = new Date();
        const secondsSinceLastUpdate = (now.getTime() - this.lastUpdated.getTime()) / 1000;
        const average = this.totalRequestsSinceLastUpdate / secondsSinceLastUpdate;
        this.lastUpdated = now;
        this.totalRequestsSinceLastUpdate = 0;
        return average;
    }
}

export async function UpdateCounter(count:number) {
    
}