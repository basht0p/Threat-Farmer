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

export interface FeedFormat {
    _id: string;
    name: string;
    url: string;
    format: string;
    observables: Array<string>;
    key?: string;
    state: boolean;
    comments: boolean;
    headers: boolean;
    purge: boolean;
    frequency: string;
    map: Array<FeedFieldRule>;
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