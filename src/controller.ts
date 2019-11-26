import CharacterHandler from "./_character-handler";

class Controller {
    CreateCharacter(args: ICreateCharacterController): void {
        let container = Controller.GenerateContainer();
        container.characterHandler.CreateCharacter(args.CharacterName);
    }

    private static GenerateContainer(): Container {
        let container: Container;
        container.characterHandler = new CharacterHandler();
        return container;
    }
}

export default Controller;