interface ICreateCharacter {
    characterName: string;
}

function CreateCharacter(args: ICreateCharacter): boolean {
    return true;
}

export default {CreateCharacter};