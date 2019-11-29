const Constants = {
    CURRENCY_ATP: "AP"
};
class ServiceLocator {
    static init() {
        this.registeredClasses = new Map();
        this.initialised = true;
    }
    static register(t, instance) {
        if (!this.initialised) {
            this.init();
        }
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;
        this.registeredClasses.set(interfaceName, instance);
    }
    static resolve(t) {
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;
        return this.registeredClasses.get(interfaceName);
    }
}
ServiceLocator.initialised = false;
class CharacterInventoryService {
    FetchItems() {
        let itemsRequest = { CharacterId: this.characterId, PlayFabId: currentPlayerId };
        let itemsResponse = server.GetCharacterInventory(itemsRequest);
        this.characterItems = itemsResponse.Inventory;
    }
    GrantItems(itemIds) {
        const itemsGrantRequest = {
            CharacterId: this.characterId,
            ItemIds: itemIds,
            PlayFabId: currentPlayerId
        };
        const itemsGrantResult = server.GrantItemsToCharacter(itemsGrantRequest);
        if (itemsGrantResult.ItemGrantResults !== undefined) {
            itemsGrantResult.ItemGrantResults.forEach(i => this.characterItems.push(i));
        }
        return itemsGrantResult;
    }
    RevokeItem(item) {
        const result = server.RevokeInventoryItem(item);
        const revokedItem = -this.characterItems.findIndex(i => i.ItemInstanceId === item.ItemInstanceId);
        this.characterItems = this.characterItems.splice(revokedItem, 1);
        return result;
    }
    ConsumeItems(items) {
        const consumeItemResults = [];
        for (const key in items) {
            const itemInstanceId = key;
            const amount = items[key];
            const consumeRequest = {
                CharacterId: "",
                ConsumeCount: 0,
                ItemInstanceId: "",
                PlayFabId: ""
            };
            consumeItemResults.push(server.ConsumeItem(consumeRequest));
        }
        consumeItemResults.forEach(c => {
            const localItem = this.characterItems.find(i => i.ItemInstanceId === c.ItemInstanceId);
            localItem.RemainingUses = c.RemainingUses;
        });
        return consumeItemResults;
    }
    UpdateItemCustomData(itemInstanceId, data) {
        const stringifyData = {};
        for (const key in Object.getOwnPropertyNames(data)) {
            stringifyData[key] = data[key];
        }
        let customDataUpdateRequest = {
            CharacterId: this.characterId,
            Data: stringifyData,
            ItemInstanceId: itemInstanceId,
            PlayFabId: currentPlayerId
        };
        server.UpdateUserInventoryItemCustomData(customDataUpdateRequest);
        const updatedItem = this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
        for (const key in Object.getOwnPropertyNames(data)) {
            updatedItem.CustomData[key] = data[key];
        }
    }
    GetLocalInventoryItem(itemInstanceId) {
        return this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
    }
    FindItemWithCustomData(itemId, key, value) {
        const itemsOfType = this.characterItems.filter(i => i.ItemId === itemId);
        return itemsOfType.find(i => i[key] === value);
    }
}
class CharacterService {
    Create(characterName) {
        const grantCharRequest = {
            PlayFabId: currentPlayerId,
            CharacterName: characterName,
            CharacterType: "Cell"
        };
        server.GrantCharacterToUser(grantCharRequest);
    }
}
class CurrencyService {
    Remove(amount, type) {
        const subtractRequest = {
            Amount: amount,
            PlayFabId: currentPlayerId,
            VirtualCurrency: type
        };
        return server.SubtractUserVirtualCurrency(subtractRequest);
    }
    Add(amount, type) {
        const request = {
            Amount: amount,
            PlayFabId: currentPlayerId,
            VirtualCurrency: type
        };
        return server.AddUserVirtualCurrency(request);
    }
}
class EnzymeService {
    Purchase(enzymeId, costs, organelleItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        invService.ConsumeItems(costs);
        // create the enzyme and update custom data
        const enzyme = invService.GrantItems([enzymeId]);
        const enzymeInstanceId = enzyme.ItemGrantResults[0].ItemInstanceId;
        invService.UpdateItemCustomData(enzymeInstanceId, { organelleItemInstanceId });
        // update custom data from organelle
        const organelle = invService.GetLocalInventoryItem(organelleItemInstanceId);
        const enzymeCreatedString = organelle.CustomData["enzymesCreated"] || "0";
        const enzymesCreated = parseInt(enzymeCreatedString) + 1;
        invService.UpdateItemCustomData(organelleItemInstanceId, { enzymesCreated: enzymesCreated.toString() });
    }
    Equip(enzymeItemInstanceId, organelleItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        invService.UpdateItemCustomData(enzymeItemInstanceId, { organelleItemInstanceId });
        const genService = ServiceLocator.resolve(GeneratorService);
        genService.Create(enzymeItemInstanceId);
    }
    UnEquip(enzymeItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        invService.UpdateItemCustomData(enzymeItemInstanceId, { organelleItemInstanceId: "" });
        const genService = ServiceLocator.resolve(GeneratorService);
        genService.Destroy(enzymeItemInstanceId);
    }
}
class GeneratorService {
    Claim(generatorItemInstanceId) {
        const dataService = ServiceLocator.resolve(TitleDataService);
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const generator = invService.characterItems.find(i => i.ItemInstanceId === generatorItemInstanceId);
        const generatorTitleData = dataService.generators.find(g => g.Id === generator.ItemId);
        const data = generator.CustomData;
        const value = GeneratorService.getGeneratorValue(data["startTime"], data["limit"], data["pace"]);
        if (generatorTitleData.ItemId === Constants.CURRENCY_ATP) {
            const currencyService = ServiceLocator.resolve(CurrencyService);
            currencyService.Add(value, Constants.CURRENCY_ATP);
        }
        else {
            const itemIds = [];
            // TODO: there must be a better way to grant multiple items
            for (let i = 0; i < value; i++) {
                itemIds.push(generatorTitleData.ItemId);
            }
            invService.GrantItems(itemIds);
        }
        const customData = { startTime: GeneratorService.nowTimestamp() };
        invService.UpdateItemCustomData(generatorItemInstanceId, customData);
    }
    Create(enzymeItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const dataService = ServiceLocator.resolve(TitleDataService);
        const enzyme = invService.GetLocalInventoryItem(enzymeItemInstanceId);
        const enzymeTitleData = dataService.enzymes.find(e => e.Id === enzyme.ItemId);
        const generatorTitleData = dataService.generators.find(g => g.Id === enzymeTitleData.GeneratorId);
        const generator = invService.GrantItems([enzymeTitleData.Id]);
        const customData = GeneratorService.generateCustomData(generatorTitleData, enzymeItemInstanceId);
        invService.UpdateItemCustomData(generator.ItemGrantResults[0].ItemInstanceId, customData);
    }
    Destroy(enzymeItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const generator = invService.FindItemWithCustomData("generator", "enzymeItemInstanceId", enzymeItemInstanceId);
        invService.RevokeItem({
            CharacterId: invService.characterId,
            ItemInstanceId: generator.ItemInstanceId,
            PlayFabId: currentPlayerId
        });
    }
    static generateCustomData(generatorTitleData, enzymeItemInstanceId) {
        return {
            startTime: GeneratorService.nowTimestamp(),
            limit: generatorTitleData.Limit.toString(),
            pace: generatorTitleData.Pace.toString(),
            resource: generatorTitleData.ItemId,
            enzymeItemInstanceId: enzymeItemInstanceId
        };
    }
    static nowTimestamp() {
        return Math.floor(Date.now() / 1000).toString();
    }
    static getGeneratorValue(startTimeS, limitS, paceS) {
        const startTime = parseInt(startTimeS);
        const limit = parseInt(limitS);
        const pace = parseInt(paceS);
        const stopTime = Math.floor(Date.now() / 1000);
        const seconds = stopTime - startTime;
        const value = seconds * pace;
        if (value < 1) {
            return 0;
        }
        if (value < limit) {
            return value;
        }
        return limit;
    }
}
class OrganelleService {
    Purchase(organelleId, atpPrice) {
        // TODO: verify with titleData & inventory to ensure player can purchase it
        const currencyService = ServiceLocator.resolve(CurrencyService);
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        currencyService.Remove(atpPrice, Constants.CURRENCY_ATP);
        inventoryService.GrantItems([organelleId]);
    }
    Equip(itemInstanceId, posX, posY) {
        // TODO: do some verifications like ensuring tile is available
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        const enzymesCreated = "0";
        inventoryService.UpdateItemCustomData(itemInstanceId, { enzymesCreated, posX, posY });
    }
}
class TitleDataService {
    Fetch() {
        // TODO: fetch organelles
        const request = { Keys: ["Enzymes", "Generators"] };
        const result = server.GetTitleData(request);
        if (result.Data.hasOwnProperty("Generators")) {
            this.generators = JSON.parse(result.Data["Generators"]);
        }
        if (result.Data.hasOwnProperty("Enzymes")) {
            this.enzymes = JSON.parse(result.Data["Enzymes"]);
        }
    }
}
class Controller {
    constructor() {
        Controller.registerServices();
        const titleDataService = ServiceLocator.resolve(TitleDataService);
        titleDataService.Fetch();
    }
    CreateCharacter(args) {
        const characterService = ServiceLocator.resolve(CharacterService);
        characterService.Create(args.CharacterName);
    }
    PurchaseOrganelle(args) {
        Controller.setupInventory(args.CharacterId);
        const organelleService = ServiceLocator.resolve(OrganelleService);
        organelleService.Purchase(args.OrganelleId, args.AtpCost);
    }
    EquipOrganelle(args) {
        Controller.setupInventory(args.CharacterId);
        const organelleService = ServiceLocator.resolve(OrganelleService);
        organelleService.Equip(args.OrganelleItemInstanceId, args.PosX.toString(), args.PosY.toString());
    }
    PurchaseEnzyme(args) {
        Controller.setupInventory(args.CharacterId);
        const enzymeService = ServiceLocator.resolve(EnzymeService);
        enzymeService.Purchase(args.EnzymeId, args.costs, args.OrganelleItemInstanceId);
    }
    EquipEnzyme(args) {
        Controller.setupInventory(args.CharacterId);
        const enzymeService = ServiceLocator.resolve(EnzymeService);
        enzymeService.Equip(args.EnzymeItemInstanceId, args.OrganelleItemInstanceId);
    }
    UnEquipEnzyme(args) {
        Controller.setupInventory(args.CharacterId);
        const enzymeService = ServiceLocator.resolve(EnzymeService);
        enzymeService.UnEquip(args.EnzymeItemInstanceId);
    }
    ClaimGenerator(args) {
        Controller.setupInventory(args.CharacterId);
        const generatorService = ServiceLocator.resolve(GeneratorService);
        generatorService.Claim(args.generatorItemInstanceId);
    }
    static setupInventory(characterId) {
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        inventoryService.characterId = characterId;
        inventoryService.FetchItems();
    }
    static registerServices() {
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
handlers["PurchaseEnzyme"] = controller.PurchaseEnzyme;
handlers["EquipEnzyme"] = controller.EquipEnzyme;
handlers["UnEquipEnzyme"] = controller.UnEquipEnzyme;
handlers["ClaimGenerator"] = controller.ClaimGenerator;