import GetCharacterInventoryRequest = PlayFabServerModels.GetCharacterInventoryRequest;
import ItemInstance = PlayFabServerModels.ItemInstance;
import CharacterResult = PlayFabServerModels.CharacterResult;
import CharacterInventoryService from "../services/character-inventory-service";
import ServiceLocator from "../utils/service-locator";

class CellService
{
    GetCellInformation(characterId : string, masterPlayerAccountId : string) : CellInformation
    {
        const charData = CellService.GetCharacterData(characterId, masterPlayerAccountId);
        const items = CellService.GetItemsFromCharacter(characterId, masterPlayerAccountId);

        log.info("charData", charData);
        log.info("items", items);

        const resourceItems : Item[] = [];
        let numberOfPlastids = 0;
        for (const item of items)
        {
            if (item.ItemClass === "resource")
            {
                resourceItems.push({ItemId: item.ItemId, Amount: item.RemainingUses});
            }

            if (item.ItemId === "plastid")
            {
                numberOfPlastids++;
            }
        }

        const defenseStats = CellService.GetSuccessRates(numberOfPlastids);

        // GetCharacterData
        // get inventory

        // get list of resources
        // get number of organelles that are plastid

        return {
            Items: resourceItems,
            MinAmountForSuccess: defenseStats.MinAmountForSuccess,
            SuccessRate: defenseStats.SuccessRate,
            CharacterName: charData.CharacterName
        };
    }

    StealCellResources(args : IStealCellResourcesController) : StealResult {
        const characterInventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        const bacterophageItemInstance = characterInventoryService.characterItems.find(i => i.ItemId === "bacteriophage");
        const consumeRequest = [{ItemInstanceId: bacterophageItemInstance.ItemInstanceId, ItemId: "bacteriophage", Amount: args.BacteriophageUses}];
        characterInventoryService.ConsumeItems(consumeRequest);

        // get target player items
        const items = CellService.GetItemsFromCharacter(args.TargetCharacterId, args.TargetMasterPlayerAccountId);

        // get number of plastids & resources
        const resourceItems: ItemInstance[] = [];
        let numberOfPlastids = 0;

        for (const item of items) {
            if (item.ItemClass === "resource") {
                resourceItems.push(item);
            }

            if (item.ItemId === "plastid") {
                numberOfPlastids++;
            }
        }

        // calculate if steal is succeed
        if (!CellService.StealSuccess(numberOfPlastids, args.BacteriophageUses))
        {
            return {
                Items: [],
                IsSuccess: false
            };
        }
        // Get how many items will be stealing
        const stealItems = CellService.CalculateStealItems(resourceItems);
        log.info("stealItems", stealItems);

        // Consume them from target player


        // Grant items to current player

        return {
            IsSuccess: true,
            Items: stealItems
        };
    }

    private static CalculateStealItems(targetItems : ItemInstance[]) : PurchaseCost[]
    {
        const stealedItems : PurchaseCost[] = [];

        targetItems.forEach(i => {
            let amount = Math.round(i.RemainingUses * 0.5);
            if (amount < 1)
                amount = 1;

            stealedItems.push({ItemId: i.ItemId, ItemInstanceId: i.ItemInstanceId, Amount: amount});
        });
        return stealedItems;
    }

    private static StealSuccess(plastidNumbers : number, bacterophateNumber : number) : boolean
    {
        const successRates = CellService.GetSuccessRates(plastidNumbers);

        if (bacterophateNumber < successRates.MinAmountForSuccess) {
            return false;
        }

        const bacterophageNumberForSuccessRate = bacterophateNumber - successRates.MinAmountForSuccess + 1;

        const successChance = successRates.SuccessRate * bacterophageNumberForSuccessRate;

        if (successChance > 1)
            return true;

        return Math.random() < successChance;
    }

    private static GetSuccessRates(plastidNumbers : number)
    {
        // calculate the min amount for success = 1 + plastidsNumber
        // calculate success rate = 0.5 /plastidsNumber

        return {
            MinAmountForSuccess: 1 + plastidNumbers,
            SuccessRate: 0.5 / (1 + plastidNumbers)
        };
    }

    private static ConsumeItemsFromCharacter()
    {
        // TODO: do stuff...
    }

    private static GetItemsFromCharacter(characterId : string, masterPlayerAccountId : string) : ItemInstance[]
    {
        let itemsRequest : GetCharacterInventoryRequest = {CharacterId: characterId, PlayFabId: masterPlayerAccountId};
        let itemsResponse = server.GetCharacterInventory(itemsRequest);

        return itemsResponse.Inventory;
    }

    private static GetCharacterData(characterId : string, masterPlayerAccountId : string) : CharacterResult
    {
        //const request = {CharacterId: characterId, PlayFabId: masterPlayerAccountId};
        //return server.GetCharacterData(request);

        const response = server.GetAllUsersCharacters({PlayFabId: masterPlayerAccountId});
        log.info("GetAllUsersCharacters", response);
        for (const character of response.Characters)
        {
            if (character.CharacterId === characterId)
                return character;
        }
        return null;
    }
}

export default CellService;