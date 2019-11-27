declare const CURRENCY_ATP = 'AP';

interface ICreateCharacterController
{
    CharacterName : string;
}

// OrganelleService
interface IPurchaseOrganelleController
{
    CharacterId : string,
    OrganelleId : string,
    AtpCost : number
}

interface IEquipOrganelleController
{
    CharacterId : string,
    OrganelleItemInstanceId : string,
    PosX : number,
    PosY : number
}

// EnzymeService
interface IPurchaseEnzymeController
{
    CharacterId : string,
    EnzymeId : string,
    OrganelleItemInstanceId : string,
    costs : {[key : string] : number}
}

interface IEquipEnzymeController {
    CharacterId : string,
    EnzymeItemInstanceId : string,
    OrganelleItemInstanceId : string
}

interface IUnEquipEnzymeController
{
    CharacterId : string,
    EnzymeItemInstanceId : string
}