import { SiloDb } from "../services/mongo";
import { FeedConfiguration } from "./feed";

export interface SiloConfiguration {
    name: string,
    id: string,
    members: Array<string>
}

export class Silo {
    name: string;
    readonly id: string;
    members: Array<string>;

    constructor(obj: SiloConfiguration) {
        this.name = obj.name;
        this.id = obj.id;
        this.members = obj.members;
    };

    public async save() {
        var silo = new SiloDb(this)
        silo.save()
        .then(() => {
            console.log(`Successfully added configuration for silo ${silo.name} (${silo.id})`)
        });
    }
}