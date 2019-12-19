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

    static GetSuccessRates(plastidNumbers : number) : object
    {
        return {
            MinAmountForSuccess: 1,
            SuccessRate: 0.5
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
        response.Characters.forEach(c => {
           if (c.CharacterId == characterId)
           {
               return c;
           }
        });
        return null;
    }
}

export default CellService;