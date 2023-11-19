import { FeedConfiguration } from "./feed"

export interface SiloConfiguration {
    name: string,
    id: string,
    api: string,
    members: Array<String>,
    observables: Array<string>,
    state: boolean
}

export const EmptySilo: SiloConfiguration = {
    id: "",
    name: "",
    api: "",
    members: [],
    observables: [],
    state: false
}