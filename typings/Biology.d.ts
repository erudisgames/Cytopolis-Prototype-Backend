// Controller
interface Container {
    characterHandler: CharacterHandler
}

interface ICreateCharacterController {
    CharacterName: string;
}

interface IPurchaseOrganelleController {
    OrganelleId: string,
    AtpCost: number
}

interface IEquipOrganelleController {
    ItemId: string,
    PosX: number,
    PosY: number
}

declare const ATP_CURRENCY = 'AP';

// CharacterHandler
interface CharacterHandler {
    CreateCharacter(characterName : string) : void;
}