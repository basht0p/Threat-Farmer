import {FeedDb, SiloDb, dataDb}  from "../services/mongo";

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

    public async save() {
        var feed = new FeedDb(this)
        dataDb.createCollection(this.id)
        feed.save()
        .then(() => {
            console.log(`Successfully added configuration for ${feed.name} (${feed.id})`)
        });
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
    const result = await SiloDb.updateMany(
        { members: id },
        { $pull: { members: id } }
    );

    dataDb.dropCollection(id);

    console.log(result)
    return FeedDb.findByIdAndDelete(id);
}

export async function updateFeed(id: string, newFeed: FeedConfiguration) {
    return FeedDb.findByIdAndUpdate(id, newFeed).then(result => {
        if(result != undefined){
            if(result._id.toString() == id){
                console.log(`Successfully updated ${newFeed.name} (${id})`)
                return "Success"
            }
        } else {
            console.log("No result returned from update function.")
        }
    }).catch(err => {
        console.log(`An error occured with updating the DB: ${err}`)
    });
}

export async function toggleFeed(id: string) {
    const r = await FeedDb.findById(id)

    if(r != undefined){
            
        var newState = !r.state

        const feedResult = new Feed({
            id: `${r._id}`,
            name: `${r.name}`,
            url: `${r.url}`,
            format: `${r.format}`,
            observables: r.observables,
            key: `${r.key}`,
            state: newState,
            comments: r.comments,
            headers: r.headers,
            purge: r.purge,
            frequency: `${r.frequency}`,
            map: r.map
        })

        return FeedDb.findByIdAndUpdate(id, feedResult).then(() => {
            if(newState){
                console.log(`Successfully enabled ${id}`)
            } else {
                console.log(`Successfully disabled ${id}`)
            }
        })
    }
}