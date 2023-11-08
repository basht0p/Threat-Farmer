export interface SiloConfiguration {
    name: string,
    id: string,
    api: string,
    format: string,
    observables: Array<string>,
    state: boolean
}

export const EmptySilo: SiloConfiguration = {
    id: "",
    name: "",
    api: "",
    format: "",
    observables: [],
    state: false
}