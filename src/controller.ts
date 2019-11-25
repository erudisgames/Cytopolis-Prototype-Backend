interface ICreateCharacter {
    characterName: string;
}

function CreateCharacter(args: ICreateCharacter): void {
    CharacterHandler.createCharacter(args.characterName);
}

const Controller = {CreateCharacter};

// TODO: comment for compilation
//export default Controller;