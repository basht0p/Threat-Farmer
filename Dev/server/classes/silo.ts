import { SiloDb, dataDb } from "../services/mongo";

export interface SiloConfiguration {
    name: string,
    id: string,
    api: string,
    members: Array<string>,
    state: Boolean
}

export class Silo {
    name: string;
    readonly id: string;
    api: string;
    members: Array<string>;
    state: Boolean;

    constructor(obj: SiloConfiguration) {
        this.name = obj.name;
        this.id = obj.id;
        this.api = obj.api;
        this.members = obj.members;
        this.state = obj.state
    };

    public async save() {
        var silo = new SiloDb(this)
        silo.save()
        .then(() => {
            console.log(`Successfully added configuration for silo ${silo.name} (${silo.id})`)
        });
    }
}

export async function getAllSilos(){
    var r = await SiloDb.find()

    const list: Array<Silo> = [];

    for (var i = 0; i < r.length; i++){
        const siloResult = new Silo({
            id: `${r[i]._id}`,
            name: `${r[i].name}`,
            members: r[i].members,
            api: `${r[i].api}`,
            state: r[i].state
        })

        list.push(siloResult)
    }

    return list
}

export async function deleteSilo(id: string){
    return SiloDb.findByIdAndDelete(id);
}

export async function updateSilo(id: string, newSilo: SiloConfiguration) {
    return SiloDb.findByIdAndUpdate(id, newSilo).then(result => {
        if(result != undefined){
            if(result._id.toString() == id){
                console.log(`Successfully updated ${newSilo.name} (${id})`)
                return "Success"
            }
        } else {
            console.log("No result returned from update function.")
        }
    }).catch(err => {
        console.log(`An error occured with updating the DB: ${err}`)
    });
}

export async function toggleSilo(id: string) {
    const r = await SiloDb.findById(id)

    if(r != undefined){
            
        var newState = !r.state

        const SiloResult = new Silo({
            id: `${r._id}`,
            name: `${r.name}`,
            members: r.members,
            api: `${r.api}`,
            state: newState
        })

        return SiloDb.findByIdAndUpdate(id, SiloResult).then(() => {
            if(newState){
                console.log(`Successfully enabled: ${id}`)
            } else {
                console.log(`Successfully disabled: ${id}`)
            }
        })
    }
}