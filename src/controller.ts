import CharacterService from "./services/character-service";
import ServiceLocator from "./utils/service-locator";
import CurrencyService from "./services/currency-service";
import CharacterInventoryService from "./services/character-inventory-service";
import OrganelleService from "./services/organelle-service";
import EnzymeService from "./services/enzyme-service";

class Controller {
    constructor()
    {
        Controller.registerServices();
    }

    CreateCharacter(args: ICreateCharacterController): void
    {
        const characterService = <CharacterService> ServiceLocator.resolve(CharacterService);
        characterService.Create(args.CharacterName);
    }

    PurchaseOrganelle(args: IPurchaseOrganelleController) : void
    {
        Controller.setupInventory(args.CharacterId);
        const organelleService = <OrganelleService> ServiceLocator.resolve(OrganelleService);
        organelleService.Purchase(args.OrganelleId, args.AtpCost);
    }

    EquipOrganelle(args: IEquipOrganelleController) : void
    {
        Controller.setupInventory(args.CharacterId);
        const organelleService = <OrganelleService> ServiceLocator.resolve(OrganelleService);
        organelleService.Equip(args.OrganelleItemInstanceId, args.PosX.toString(), args.PosY.toString())
    }

    PurchaseEnzyme(args : IPurchaseEnzymeController) : void
    {
        Controller.setupInventory(args.CharacterId);
        const enzymeService = <EnzymeService> ServiceLocator.resolve(EnzymeService);
        enzymeService.Purchase(args.EnzymeId, args.costs, args.OrganelleItemInstanceId);
    }

    EquipEnzyme(args : IEquipEnzymeController) : void
    {
        Controller.setupInventory(args.CharacterId);
        const enzymeService = <EnzymeService> ServiceLocator.resolve(EnzymeService);
        enzymeService.Equip(args.EnzymeItemInstanceId, args.OrganelleItemInstanceId);
    }

    UnEquipEnzyme(args : IUnEquipEnzymeController) : void
    {
        Controller.setupInventory(args.CharacterId);
        const enzymeService = <EnzymeService> ServiceLocator.resolve(EnzymeService);
        enzymeService.UnEquip(args.EnzymeItemInstanceId);
    }

    private static setupInventory(characterId: string)
    {
        const inventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        inventoryService.characterId = characterId;
        inventoryService.FetchItems();
    }

    private static registerServices(): void
    {
        ServiceLocator.register(CharacterService, new CharacterService());
        ServiceLocator.register(CurrencyService, new CurrencyService());
        ServiceLocator.register(CharacterInventoryService, new CharacterInventoryService());
        ServiceLocator.register(OrganelleService, new OrganelleService());
    }
}

export default Controller;