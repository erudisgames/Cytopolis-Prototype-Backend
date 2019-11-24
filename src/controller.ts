interface ICreateCharacter {
    characterName: string;
}

function CreateCharacter(args: ICreateCharacter): boolean {
    log.info("hello World!");
    return true;
}

export default {CreateCharacter}