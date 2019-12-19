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
    constructor() {
        this.characterItems = [];
    }
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
        for (const purchaseCost of items) {
            const itemInstanceId = purchaseCost.ItemInstanceId;
            const amount = purchaseCost.Amount;
            const consumeRequest = {
                CharacterId: this.characterId,
                ConsumeCount: amount,
                ItemInstanceId: itemInstanceId,
                PlayFabId: currentPlayerId
            };
            consumeItemResults.push(server.ConsumeItem(consumeRequest));
        }
        consumeItemResults.forEach(c => {
            const localItem = this.characterItems.find(i => i.ItemInstanceId === c.ItemInstanceId);
            // TODO: log error
            if (localItem) {
                localItem.RemainingUses = c.RemainingUses;
            }
        });
        return consumeItemResults;
    }
    UpdateItemCustomData(itemInstanceId, data) {
        const stringifyData = {};
        for (const key of Object.getOwnPropertyNames(data)) {
            // TODO: this is a cheap solution for playfab 20 bytes limits in free tier
            //const value: string = key.includes("InstanceId") ? data[key].slice(0,20) : data[key];
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
        if (updatedItem) {
            if (updatedItem.CustomData === undefined) {
                updatedItem.CustomData = {};
            }
            for (const key of Object.getOwnPropertyNames(data)) {
                updatedItem.CustomData[key] = data[key];
            }
        }
    }
    GetLocalInventoryItem(itemInstanceId) {
        return this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
    }
    FindItemWithCustomData(itemClass, key, value) {
        const itemsOfType = this.characterItems.filter(i => i.ItemClass === itemClass);
        return itemsOfType.find(i => i.CustomData !== undefined && i.CustomData[key] === value);
    }
}
class CharacterService {
    Create(characterName) {
        const grantCharRequest = {
            PlayFabId: currentPlayerId,
            CharacterName: characterName,
            CharacterType: "Cell"
        };
        return server.GrantCharacterToUser(grantCharRequest);
    }
    JoinToClan(characterId, sharedGroupId) {
        const request = {
            Members: [{
                    Id: characterId,
                    Type: "character"
                }],
            Group: {
                Id: sharedGroupId,
                Type: "group"
            }
        };
        return entity.AddMembers(request);
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
class TitleDataService {
    constructor() {
        this.enzymes = {};
        this.generators = {};
    }
    FetchData() {
        // TODO: fetch organelles
        const titleDataRequest = { "Keys": ["Enzymes", "Generators"] };
        const titleDataResult = server.GetTitleData(titleDataRequest);
        // TODO: abstract mechanisim
        if (titleDataResult.Data.hasOwnProperty("Enzymes")) {
            this.enzymes = JSON.parse(titleDataResult.Data["Enzymes"]);
        }
        if (titleDataResult.Data.hasOwnProperty("Generators")) {
            this.generators = JSON.parse(titleDataResult.Data["Generators"]);
        }
    }
}
class CellService {
    GetCellInformation(characterId, masterPlayerAccountId) {
        const charData = CellService.GetCharacterData(characterId, masterPlayerAccountId);
        const items = CellService.GetItemsFromCharacter(characterId, masterPlayerAccountId);
        log.info("charData", charData);
        log.info("items", items);
        // GetCharacterData
        // get inventory
        // get list of resources
        // get number of organelles that are plastid
        // calculate the min amount for success = 1 + plastidsNumber
        // calculate success rate = 0.5 /plastidsNumber
        return {
            Items: null,
            MinAmountForSuccess: 666,
            SuccessRate: 0.5,
            CharacterName: "Hello World!!!!"
        };
    }
    static GetSuccessRates(plastidNumbers) {
        return {
            MinAmountForSuccess: 1,
            SuccessRate: 0.5
        };
    }
    static GetItemsFromCharacter(characterId, masterPlayerAccountId) {
        let itemsRequest = { CharacterId: characterId, PlayFabId: masterPlayerAccountId };
        let itemsResponse = server.GetCharacterInventory(itemsRequest);
        return itemsResponse.Inventory;
    }
    static GetCharacterData(characterId, masterPlayerAccountId) {
        //const request = {CharacterId: characterId, PlayFabId: masterPlayerAccountId};
        //return server.GetCharacterData(request);
        const response = server.GetAllUsersCharacters({ PlayFabId: masterPlayerAccountId });
        log.info("GetAllUsersCharacters", response);
        response.Characters.forEach(c => {
            if (c.CharacterId == characterId) {
                return c;
            }
        });
        return null;
    }
}
class EnzymeService {
    Purchase(enzymeId, costs, organelleItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const currencyService = ServiceLocator.resolve(CurrencyService);
        const resourceCosts = costs.filter(c => c.ItemId !== Constants.CURRENCY_ATP);
        const atpCost = costs.find(c => c.ItemInstanceId === Constants.CURRENCY_ATP);
        invService.ConsumeItems(resourceCosts);
        if (atpCost != undefined) {
            currencyService.Remove(atpCost.Amount, Constants.CURRENCY_ATP);
        }
        invService.GrantItems([enzymeId]);
        //const enzymeInstanceId = enzyme.ItemGrantResults[0].ItemInstanceId;
        //invService.UpdateItemCustomData(enzymeInstanceId, {orgItemInstanceId: organelleItemInstanceId});
        // update custom data from organelle
        const organelle = invService.GetLocalInventoryItem(organelleItemInstanceId);
        const enzymeCreatedString = organelle.CustomData["enzymesCreated"] || "0";
        const enzymesCreated = parseInt(enzymeCreatedString) + 1;
        invService.UpdateItemCustomData(organelleItemInstanceId, { enzymesCreated: enzymesCreated.toString() });
    }
    Equip(enzymeItemInstanceId, organelleItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        invService.UpdateItemCustomData(enzymeItemInstanceId, { orgItemInstanceId: organelleItemInstanceId });
        const genService = ServiceLocator.resolve(GeneratorService);
        genService.Create(enzymeItemInstanceId);
    }
    UnEquip(enzymeItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        invService.UpdateItemCustomData(enzymeItemInstanceId, { orgItemInstanceId: "" });
        const genService = ServiceLocator.resolve(GeneratorService);
        genService.Destroy(enzymeItemInstanceId);
    }
}
class GeneratorService {
    Claim(GeneratorItemInstanceId) {
        const dataService = ServiceLocator.resolve(TitleDataService);
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const generator = invService.characterItems.find(i => i.ItemInstanceId === GeneratorItemInstanceId);
        const generatorTitleData = dataService.generators[generator.ItemId];
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
        invService.UpdateItemCustomData(GeneratorItemInstanceId, customData);
    }
    Create(enzymeItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const dataService = ServiceLocator.resolve(TitleDataService);
        const enzyme = invService.GetLocalInventoryItem(enzymeItemInstanceId);
        const organelle = invService.GetLocalInventoryItem(enzyme.CustomData["orgItemInstanceId"]);
        const enzymeTitleData = dataService.enzymes[enzyme.ItemId];
        const generatorTitleData = dataService.generators[enzymeTitleData.GeneratorId];
        const generator = invService.GrantItems([generatorTitleData.Id]);
        const customData = GeneratorService.generateCustomData(generatorTitleData, enzymeItemInstanceId, Number(organelle.CustomData["level"]));
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
    static generateCustomData(generatorTitleData, enzymeItemInstanceId, organelleLevel) {
        const limit = generatorTitleData.Limit * organelleLevel;
        const pace = generatorTitleData.Pace * organelleLevel;
        return {
            startTime: GeneratorService.nowTimestamp(),
            limit: limit.toString(),
            pace: pace.toString(),
            resource: generatorTitleData.ItemId,
            enzymeItemInstanceId: enzymeItemInstanceId
        };
    }
    static nowTimestamp() {
        return Math.floor(Date.now() / 1000).toString();
    }
    static getGeneratorValue(startTimeS, limitS, paceS) {
        const startTime = Number(startTimeS);
        const limit = Number(limitS);
        const pace = Number(paceS);
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
        if (atpPrice > 0) {
            currencyService.Remove(atpPrice, Constants.CURRENCY_ATP);
        }
        inventoryService.GrantItems([organelleId]);
    }
    Equip(itemInstanceId, posX, posY) {
        // TODO: do some verifications like ensuring tile is available
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        const enzymesCreated = "0";
        const level = "1";
        inventoryService.UpdateItemCustomData(itemInstanceId, { enzymesCreated, level, posX, posY });
    }
    LevelUp(itemInstanceId, atpPrice) {
        const currencyService = ServiceLocator.resolve(CurrencyService);
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        const organelle = inventoryService.GetLocalInventoryItem(itemInstanceId);
        const level = (Number(organelle.CustomData["level"]) + 1).toString();
        inventoryService.UpdateItemCustomData(itemInstanceId, { level });
        if (atpPrice > 0) {
            currencyService.Remove(atpPrice, Constants.CURRENCY_ATP);
        }
        const enzymeService = ServiceLocator.resolve(EnzymeService);
        const equippedEnzyme = inventoryService.FindItemWithCustomData("enzyme", "orgItemInstanceId", itemInstanceId);
        if (!equippedEnzyme) {
            return;
        }
        enzymeService.UnEquip(equippedEnzyme.ItemInstanceId);
    }
}
class Controller {
    constructor() {
        Controller.registerServices();
    }
    CreateCharacter(args) {
        Controller.setupTitleData();
        const characterService = ServiceLocator.resolve(CharacterService);
        const creationResult = characterService.Create(args.CharacterName);
        characterService.JoinToClan(creationResult.CharacterId, "DCD5DDF283F4667");
    }
    PurchaseOrganelle(args) {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const organelleService = ServiceLocator.resolve(OrganelleService);
        organelleService.Purchase(args.OrganelleId, args.AtpCost);
    }
    EquipOrganelle(args) {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const organelleService = ServiceLocator.resolve(OrganelleService);
        organelleService.Equip(args.OrganelleItemInstanceId, args.PosX.toString(), args.PosY.toString());
    }
    LevelUpOrganelle(args) {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const organelleService = ServiceLocator.resolve(OrganelleService);
        organelleService.LevelUp(args.OrganelleItemInstanceId, args.AtpCost);
    }
    PurchaseEnzyme(args) {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const enzymeService = ServiceLocator.resolve(EnzymeService);
        enzymeService.Purchase(args.EnzymeId, args.Costs, args.OrganelleItemInstanceId);
    }
    EquipEnzyme(args) {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const enzymeService = ServiceLocator.resolve(EnzymeService);
        enzymeService.Equip(args.EnzymeItemInstanceId, args.OrganelleItemInstanceId);
    }
    UnEquipEnzyme(args) {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const enzymeService = ServiceLocator.resolve(EnzymeService);
        enzymeService.UnEquip(args.EnzymeItemInstanceId);
    }
    ClaimGenerator(args) {
        Controller.setupTitleData();
        Controller.setupInventory(args.CharacterId);
        const generatorService = ServiceLocator.resolve(GeneratorService);
        generatorService.Claim(args.GeneratorItemInstanceId);
    }
    GetCellInformation(args) {
        const cellService = ServiceLocator.resolve(CellService);
        return cellService.GetCellInformation(args.CharacterId, args.MasterPlayerAccountId);
    }
    // Get Characters -> A list of characters with some information about their resources, etc..
    // Attack Player -> Using a number of bacteriophage using some sort of bidding system to see if the player can steal resources
    // Returns the result of the attack :\
    static setupInventory(characterId) {
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        inventoryService.characterId = characterId;
        inventoryService.FetchItems();
    }
    static setupTitleData() {
        const titleDataService = ServiceLocator.resolve(TitleDataService);
        titleDataService.FetchData();
    }
    static registerServices() {
        ServiceLocator.register(TitleDataService, new TitleDataService());
        ServiceLocator.register(CharacterService, new CharacterService());
        ServiceLocator.register(CurrencyService, new CurrencyService());
        ServiceLocator.register(CharacterInventoryService, new CharacterInventoryService());
        ServiceLocator.register(OrganelleService, new OrganelleService());
        ServiceLocator.register(EnzymeService, new EnzymeService());
        ServiceLocator.register(GeneratorService, new GeneratorService());
        ServiceLocator.register(CellService, new CellService());
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
handlers["GetCellInformation"] = controller.GetCellInformation;