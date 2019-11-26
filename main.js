class CharacterService {
    CreateCharacter(characterName) {
        const grantCharRequest = {
            PlayFabId: currentPlayerId,
            CharacterName: characterName,
            CharacterType: "Cell"
        };
        server.GrantCharacterToUser(grantCharRequest);
    }
}

class ServiceLocator {
    static init() {
        this.registeredClasses = new Map();
        this.initialised = true;
    }
    static register(t, instance) {
        if (!this.initialised) {
            this.init();
        }
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;
        this.registeredClasses.set(interfaceName, instance);
    }
    static resolve(t) {
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;
        return this.registeredClasses.get(interfaceName);
    }
}
ServiceLocator.initialised = false;

class Controller {
    constructor() {
        Controller.registerServices();
    }
    CreateCharacter(args) {
        ServiceLocator.resolve(CharacterService).CreateCharacter(args.CharacterName);
    }
    static registerServices() {
        ServiceLocator.register(CharacterService, new CharacterService());
    }
}

let controller = new Controller();
handlers["CreateCharacter"] = controller.CreateCharacter;
