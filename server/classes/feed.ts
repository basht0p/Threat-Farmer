import {FeedDb, FeedSchema}  from "../services/mongo";

export interface FeedConfiguration {
    name: string,
    id: string,
    url: string,
    format: string,
    observables: Array<string>,
    key: string,
    state: boolean,
    comments: boolean,
    headers: boolean,
    purge: boolean,
    frequency: string,
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
    format: string;
    observables: Array<string>;
    key: string;
    state: boolean;
    comments: boolean;
    headers: boolean;
    purge: boolean;
    frequency: string;
    map: Array<FeedFieldRule> = [];

    //// Define the full feed configuration
    constructor(obj: FeedConfiguration) {
        this.name = obj.name;
        this.id = obj.id;
        this.format = obj.format;
        this.url = obj.url;
        this.observables = obj.observables;
        this.key = obj.key;
        this.state = obj.state;
        this.comments = obj.comments;
        this.headers = obj.headers;
        this.frequency = obj.frequency;
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

    public save() {
        var feed = new FeedDb(this)
        feed.save()
        .then(() => {
            console.log(`Successfully added configuration for ${feed.name} (${feed.id})`)
        });
    }

    public update() {
        FeedDb.findByIdAndUpdate(
            this.id,
            this,
            (err: any, feed: any) => {
                if (err) {
                console.log(err);
                } else {
                console.log("Successfully updated feed!");
                }
            }
        );
    }
}

export async function getAllFeeds(){
    var r = await FeedDb.find()

    const list: Array<Feed> = [];

    for (var i = 0; i < r.length; i++){
        const feedResult = new Feed({
            id: `${r[i]._id}`,
            name: `${r[i].name}`,
            url: `${r[i].url}`,
            format: `${r[i].format}`,
            observables: r[i].observables,
            key: `${r[i].key}`,
            state: r[i].state,
            comments: r[i].comments,
            headers: r[i].headers,
            purge: r[i].purge,
            frequency: `${r[i].frequency}`,
            map: r[i].map
        })

        list.push(feedResult)
    }

    return list
}

export async function getFeed(id: string){
    return FeedDb.findById(id);
}

export async function deleteFeed(id: string){
    return FeedDb.findByIdAndDelete(id);
}