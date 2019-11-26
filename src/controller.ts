import CharacterService from "./character-service";
import ServiceLocator from "./service-locator";

class Controller {
    constructor()
    {
        Controller.registerServices();
    }

    CreateCharacter(args: ICreateCharacterController): void {
        ServiceLocator.resolve(CharacterService).CreateCharacter(args.CharacterName);
    }

    private static registerServices(): void {
        ServiceLocator.register(CharacterService, new CharacterService());
    }
}

export default Controller;