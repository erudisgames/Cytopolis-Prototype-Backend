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

interface IClaimGeneratorController
{
    CharacterId : string,
    generatorItemInstanceId : string
}

// CustomData interfaces

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

// TitleData
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