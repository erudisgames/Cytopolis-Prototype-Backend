import GetCharacterInventoryRequest = PlayFabServerModels.GetCharacterInventoryRequest;
import ItemInstance = PlayFabServerModels.ItemInstance;

class CellService
{
    GetCellInformation(characterId : string) : CellInformation
    {
        const items = this.GetItemsFromCharacter(characterId);
        // GetCharacterData
        // get inventory

        // get list of resources
        // get number of organelles that are plastid

        // calculate the min amount for success = 1 + plastidsNumber
        // calculate success rate = 0.5 /plastidsNumber
        return null;
    }

    static GetSuccessRates(plastidNumbers : number) : object
    {
        return {
            MinAmountForSuccess: 1,
            SuccessRate: 0.5
        };
    }

    GetItemsFromCharacter(characterId : string) : ItemInstance[]
    {
        let itemsRequest : GetCharacterInventoryRequest = {CharacterId: characterId, PlayFabId: currentPlayerId};
        let itemsResponse = server.GetCharacterInventory(itemsRequest);

        return itemsResponse.Inventory;
    }

    GetCharacterData(characterId : string)
    {
        const request = {CharacterId: "", PlayFabId: ""};
        const response = server.GetCharacterData(request);
    }
}

export default CellService;