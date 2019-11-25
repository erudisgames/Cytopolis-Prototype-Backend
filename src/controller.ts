interface ICreateCharacter {
    characterName: string;
}

function CreateCharacter(args: ICreateCharacter): boolean {
    log.info("hello World!");
    return true;
}

const Controller = {CreateCharacter};

// TODO: comment for compilation
//export default Controller;