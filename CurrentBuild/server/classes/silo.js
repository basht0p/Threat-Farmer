"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSilo = exports.updateSilo = exports.deleteSilo = exports.getAllSilos = exports.Silo = void 0;
const mongo_1 = require("../services/mongo");
class Silo {
    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.api = obj.api;
        this.members = obj.members;
        this.state = obj.state;
    }
    ;
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            var silo = new mongo_1.SiloDb(this);
            silo.save()
                .then(() => {
                console.log(`Successfully added configuration for silo ${silo.name} (${silo.id})`);
            });
        });
    }
}
exports.Silo = Silo;
function getAllSilos() {
    return __awaiter(this, void 0, void 0, function* () {
        var r = yield mongo_1.SiloDb.find();
        const list = [];
        for (var i = 0; i < r.length; i++) {
            const siloResult = new Silo({
                id: `${r[i]._id}`,
                name: `${r[i].name}`,
                members: r[i].members,
                api: `${r[i].api}`,
                state: r[i].state
            });
            list.push(siloResult);
        }
        return list;
    });
}
exports.getAllSilos = getAllSilos;
function deleteSilo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.SiloDb.findByIdAndDelete(id);
    });
}
exports.deleteSilo = deleteSilo;
function updateSilo(id, newSilo) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.SiloDb.findByIdAndUpdate(id, newSilo).then(result => {
            if (result != undefined) {
                if (result._id.toString() == id) {
                    console.log(`Successfully updated ${newSilo.name} (${id})`);
                    return "Success";
                }
            }
            else {
                console.log("No result returned from update function.");
            }
        }).catch(err => {
            console.log(`An error occured with updating the DB: ${err}`);
        });
    });
}
exports.updateSilo = updateSilo;
function toggleSilo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const r = yield mongo_1.SiloDb.findById(id);
        if (r != undefined) {
            var newState = !r.state;
            const SiloResult = new Silo({
                id: `${r._id}`,
                name: `${r.name}`,
                members: r.members,
                api: `${r.api}`,
                state: newState
            });
            return mongo_1.SiloDb.findByIdAndUpdate(id, SiloResult).then(() => {
                if (newState) {
                    console.log(`Successfully enabled: ${id}`);
                }
                else {
                    console.log(`Successfully disabled: ${id}`);
                }
            });
        }
    });
}
exports.toggleSilo = toggleSilo;
//# sourceMappingURL=silo.js.map