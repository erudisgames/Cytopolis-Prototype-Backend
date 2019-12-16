import CharacterService from "./services/character-service";
import ServiceLocator from "./utils/service-locator";
import CurrencyService from "./services/currency-service";
import CharacterInventoryService from "./services/character-inventory-service";
import OrganelleService from "./biology/organelle-service";
import EnzymeService from "./biology/enzyme-service";
import TitleDataService from "./services/title-data-service";
import GeneratorService from "./biology/generator-service";

class Controller {
    constructor()
    {
        Controller.registerServices();
    }

    CreateCharacter(args: ICreateCharacterController): PlayFabServerModels.GrantCharacterToUserResult
    {
        Controller.setupTitleData();
        const characterService = <CharacterService> ServiceLocator.resolve(CharacterService);
        return characterService.Create(args.CharacterName);
    }

    PurchaseOrganelle(args: IPurchaseOrganelleController) : void
    {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const organelleService = <OrganelleService> ServiceLocator.resolve(OrganelleService);
        organelleService.Purchase(args.OrganelleId, args.AtpCost);
    }

    EquipOrganelle(args: IEquipOrganelleController) : void
    {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const organelleService = <OrganelleService> ServiceLocator.resolve(OrganelleService);
        organelleService.Equip(args.OrganelleItemInstanceId, args.PosX.toString(), args.PosY.toString())
    }

    LevelUpOrganelle(args : ILevelUpOrganelleController) : void
    {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const organelleService = <OrganelleService> ServiceLocator.resolve(OrganelleService);
        organelleService.LevelUp(args.OrganelleItemInstanceId, args.AtpCost)
    }

    PurchaseEnzyme(args : IPurchaseEnzymeController) : void
    {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const enzymeService = <EnzymeService> ServiceLocator.resolve(EnzymeService);
        enzymeService.Purchase(args.EnzymeId, args.Costs, args.OrganelleItemInstanceId);
    }

    EquipEnzyme(args : IEquipEnzymeController) : void
    {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const enzymeService = <EnzymeService> ServiceLocator.resolve(EnzymeService);
        enzymeService.Equip(args.EnzymeItemInstanceId, args.OrganelleItemInstanceId);
    }

    UnEquipEnzyme(args : IUnEquipEnzymeController) : void
    {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const enzymeService = <EnzymeService> ServiceLocator.resolve(EnzymeService);
        enzymeService.UnEquip(args.EnzymeItemInstanceId);
    }

    ClaimGenerator(args : IClaimGeneratorController) : void
    {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const generatorService = <GeneratorService> ServiceLocator.resolve(GeneratorService);
        generatorService.Claim(args.GeneratorItemInstanceId);
    }

    // Get Characters -> A list of characters with some information about their resources, etc..
    // Attack Player -> Using a number of bacteriophage using some sort of bidding system to see if the player can steal resources
        // Returns the result of the attack :\

    private static setupInventory(characterId: string)
    {
        const inventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        inventoryService.characterId = characterId;
        inventoryService.FetchItems();
    }

    private static setupTitleData()
    {
        const titleDataService = <TitleDataService> ServiceLocator.resolve(TitleDataService);
        titleDataService.FetchData();
    }

    private static registerServices(): void
    {
        ServiceLocator.register(TitleDataService, new TitleDataService());
        ServiceLocator.register(CharacterService, new CharacterService());
        ServiceLocator.register(CurrencyService, new CurrencyService());
        ServiceLocator.register(CharacterInventoryService, new CharacterInventoryService());
        ServiceLocator.register(OrganelleService, new OrganelleService());
        ServiceLocator.register(EnzymeService, new EnzymeService());
        ServiceLocator.register(GeneratorService, new GeneratorService());
    }
}

const controller = new Controller();
handlers["CreateCharacter"] = controller.CreateCharacter;
handlers["PurchaseOrganelle"] = controller.PurchaseOrganelle;
handlers["EquipOrganelle"] = controller.EquipOrganelle;
handlers["LevelUpOrganelle"] = controller.LevelUpOrganelle;
handlers["PurchaseEnzyme"] = controller.PurchaseEnzyme;
handlers["EquipEnzyme"] = controller.EquipEnzyme;
handlers["UnEquipEnzyme"] = controller.UnEquipEnzyme;
handlers["ClaimGenerator"] = controller.ClaimGenerator;
