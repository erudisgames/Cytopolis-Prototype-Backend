interface ICreateCharacterController
{
    CharacterName : string;
}

interface IPurchaseOrganelleController
{
    CharacterId : string,
    OrganelleId : string,
    AtpCost : number
}

// TODO: change instanceId for instanceIdCropped

interface IEquipOrganelleController
{
    CharacterId : string,
    OrganelleItemInstanceId : string,
    PosX : number,
    PosY : number
}

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

interface IClaimGeneratorController
{
    CharacterId : string,
    generatorItemInstanceId : string
}

// Custom Data

interface OrganelleCustomData
{
    enzymesCreated: string,
    posX?: string,
    posY?: string
}

interface EnzymeCustomData
{
    organelleItemInstanceId: string
}

interface GeneratorCustomData
{
    startTime: string,
    limit?: string,
    pace?: string,
    resource?: string,
    enzymeItemInstanceId?: string
}

// Title Data
interface EnzymeTitleData
{
    Id: string,
    Name: string,
    Description: string,
    OrganelleId: string,
    GeneratorId: string
}

interface GeneratorTitleData
{
    Id: string,
    Pace: number,
    Limit: number,
    ItemId: string
}

declare type CustomDataInterface = OrganelleCustomData | EnzymeCustomData | GeneratorCustomData;