import GetCharacterInventoryRequest = PlayFabServerModels.GetCharacterInventoryRequest;
import ItemInstance = PlayFabServerModels.ItemInstance;
import CharacterResult = PlayFabServerModels.CharacterResult;

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

    private static GetSuccessRates(plastidNumbers : number)
    {

        // calculate the min amount for success = 1 + plastidsNumber
        // calculate success rate = 0.5 /plastidsNumber

        return {
            MinAmountForSuccess: 1 + plastidNumbers,
            SuccessRate: 0.5 / (1 + plastidNumbers)
        };
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