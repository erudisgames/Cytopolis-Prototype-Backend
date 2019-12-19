// misc
interface PurchaseCost
{
    ItemId: string,
    Amount: number
}

// Controller
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

interface IEquipOrganelleController
{
    CharacterId : string,
    OrganelleItemInstanceId : string,
    PosX : number,
    PosY : number
}

interface ILevelUpOrganelleController
{
    CharacterId : string,
    OrganelleItemInstanceId : string,
    AtpCost : number
}

interface IPurchaseEnzymeController
{
    CharacterId : string,
    EnzymeId : string,
    OrganelleItemInstanceId : string,
    Costs : PurchaseCost[]
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
    GeneratorItemInstanceId : string
}

interface IGetCellInformationController
{
    CharacterId : string
}

// Custom Data

interface OrganelleCustomData
{
    enzymesCreated?: string,
    level?: string,
    posX?: string,
    posY?: string
}

interface EnzymeCustomData
{
    orgItemInstanceId: string
}

interface GeneratorCustomData
{
    startTime: string,
    limit?: string,
    pace?: string,
    resource?: string,
    enzymeItemInstanceId?: string,
    organelleLevel?: string
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

// Return types
interface CellInformation
{
    Items: PurchaseCost[],
    MinAmountForSuccess: number,
    SuccessRate: number,
    CharacterName: string
}