import GrantItemsToCharacterResult = PlayFabServerModels.GrantItemsToCharacterResult;

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
