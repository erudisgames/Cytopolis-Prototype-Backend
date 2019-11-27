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
        this.currentPlayerId = currentPlayerId;
    }
    FetchItems() {
        let itemsRequest = { CharacterId: this.characterId, PlayFabId: this.currentPlayerId };
        let itemsResponse = server.GetCharacterInventory(itemsRequest);
        this.characterItems = itemsResponse.Inventory;
    }
    GrantItems(itemIds) {
        const itemsGrantRequest = {
            CharacterId: this.characterId,
            ItemIds: itemIds,
            PlayFabId: this.currentPlayerId
        };
        const itemsGrantResult = server.GrantItemsToCharacter(itemsGrantRequest);
        if (itemsGrantResult.ItemGrantResults !== undefined) {
            itemsGrantResult.ItemGrantResults.forEach(i => this.characterItems.push(i));
        }
        return itemsGrantResult;
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
        let customDataUpdateRequest = {
            CharacterId: this.characterId,
            Data: data,
            ItemInstanceId: itemInstanceId,
            PlayFabId: this.currentPlayerId
        };
        server.UpdateUserInventoryItemCustomData(customDataUpdateRequest);
        const updatedItem = this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
        for (const key in data) {
            updatedItem.CustomData[key] = data[key];
        }
    }
    GetLocalInventoryItem(itemInstanceId) {
        return this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
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
    constructor() {
        this.currentPlayerId = currentPlayerId;
    }
    Remove(amount, type) {
        const subtractRequest = {
            Amount: amount,
            PlayFabId: this.currentPlayerId,
            VirtualCurrency: type
        };
        return server.SubtractUserVirtualCurrency(subtractRequest);
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
        invService.UpdateItemCustomData(enzymeItemInstanceId, { organelleItemInstanceId: null });
        const genService = ServiceLocator.resolve(GeneratorService);
        genService.Destroy(enzymeItemInstanceId);
    }
}

class GeneratorService {
    Claim(generatorItemInstanceId) {
    }
    Create(enzymeItemInstanceId) {
    }
    Destroy(enzymeItemInstanceId) {
    }
}

class OrganelleService {
    Purchase(organelleId, atpPrice) {
        // TODO: verify with titleData & inventory to ensure player can purchase it
        const currencyService = ServiceLocator.resolve(CurrencyService);
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        currencyService.Remove(atpPrice, CURRENCY_ATP);
        inventoryService.GrantItems([organelleId]);
    }
    Equip(itemInstanceId, posX, posY) {
        // TODO: do some verifications like ensuring tile is available
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        inventoryService.UpdateItemCustomData(itemInstanceId, { posX, posY });
    }
}

class Controller {
    constructor() {
        Controller.registerServices();
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
    static setupInventory(characterId) {
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        inventoryService.characterId = characterId;
        inventoryService.FetchItems();
    }
    static registerServices() {
        ServiceLocator.register(CharacterService, new CharacterService());
        ServiceLocator.register(CurrencyService, new CurrencyService());
        ServiceLocator.register(CharacterInventoryService, new CharacterInventoryService());
        ServiceLocator.register(OrganelleService, new OrganelleService());
    }
}

const controller = new Controller();
handlers["CreateCharacter"] = controller.CreateCharacter;
handlers["PurchaseOrganelle"] = controller.PurchaseOrganelle;
handlers["EquipOrganelle"] = controller.EquipOrganelle;
handlers["PurchaseEnzyme"] = controller.PurchaseEnzyme;
handlers["EquipEnzyme"] = controller.EquipEnzyme;
handlers["UnEquipEnzyme"] = controller.UnEquipEnzyme;
