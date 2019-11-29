import CharacterService from "../services/character-service";
import CharacterInventoryService from "../services/character-inventory-service";
import CurrencyService from "../services/currency-service";
import OrganelleService from "../services/organelle-service";
import GeneratorService from "../services/generator-service";
import EnzymeService from "../services/enzyme-service";
import TitleDataService from "../services/title-data-service";

export type IRegisteredClassesGeneric =
    CharacterService |
    CharacterInventoryService |
    CurrencyService |
    OrganelleService |
    EnzymeService |
    GeneratorService |
    TitleDataService |
    undefined;

class ServiceLocator {
    static registeredClasses: Map<string, IRegisteredClassesGeneric>;
    static initialised: boolean = false;
    static init() {
        this.registeredClasses = new Map<string, IRegisteredClassesGeneric>();
        this.initialised = true;
    }

    public static register<T>(t: { new(): T }, instance: IRegisteredClassesGeneric) : void {
        if (!this.initialised) {
            this.init();
        }
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;

        this.registeredClasses.set(interfaceName, instance);
    }
    public static resolve<T>(t: { new(): T }): IRegisteredClassesGeneric {
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;

        return this.registeredClasses.get(interfaceName);
    }

}

export default ServiceLocator;