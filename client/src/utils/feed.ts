export interface FeedConfiguration {
    name: string,
    id: string,
    url: string,
    observables: Array<string>,
    key: string,
    state: boolean,
    comments: boolean,
    headers: boolean,
    purge: boolean,
    map: Array<FeedFieldRule>
}

export interface FeedFieldRule {
    default: string;
    new: string;
}

export const legalObservables: Array<string> = [
    "ip",
    "ipport",
    "domain",
    "url",
    "md5",
    "sha256"
]

export const legalFormats: Array<string> = [
    "txt",
    "csv",
    "json"
]

export class Feed {
    name: string;
    readonly id: string;
    url: string;
    observables: Array<string>;
    key: string;
    state: boolean = false;
    comments: boolean = false;
    headers: boolean = false;
    purge: boolean = false;
    map: Array<FeedFieldRule> = [];

    //// Define the full feed configuration
    constructor(obj: FeedConfiguration) {
        
        this.name = obj.name;
        this.id = obj.id;
        this.url = obj.url;
        this.observables = obj.observables;
        this.key = obj.key;
        this.state = obj.state;
        this.comments = obj.comments;
        this.headers = obj.headers;
        this.purge = obj.purge;
        this.map = obj.map;
    };

    //// Adds a legal observable to the list for this feed
    public addObservable(observable: string) {
        if (!legalObservables.includes(observable)){
            return `${this.id} (${this.name}): Illegal Observable ${observable}`
        } else if (this.observables.includes(observable)) {
            return `${this.id} (${this.name}): Observable ${observable} already exists`
        } else {
            this.observables.push(observable)
            return `${this.id} (${this.name}): Observable ${observable} added`
        }
    }
    
    //// Removes a legal observable to the list for this feed
    public removeObservable(observable: string) {
        if (!legalObservables.includes(observable)){
            return `${this.id} (${this.name}): Illegal observable ${observable}`
        } else if (!this.observables.includes(observable)) {
            return `${this.id} (${this.name}): Observable ${observable} doesn't exist`
        } else if (this.observables.length === 1) {
            return `${this.id} (${this.name}): Observable list can't be empty. Add a new one before removing ${observable}`
        } else {
            const index = this.observables.indexOf(observable);
            this.observables.splice(index, 1);
            return `${this.id} (${this.name}): Observable ${observable} removed`
        }
    }
}