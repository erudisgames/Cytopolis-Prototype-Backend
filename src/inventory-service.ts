import ItemInstance = PlayFabServerModels.ItemInstance;
import GrantItemsToCharacterResult = PlayFabServerModels.GrantItemsToCharacterResult;
import ModifyUserVirtualCurrencyResult = PlayFabServerModels.ModifyUserVirtualCurrencyResult;
import SubtractUserVirtualCurrencyRequest = PlayFabServerModels.SubtractUserVirtualCurrencyRequest;
import GetCharacterInventoryRequest = PlayFabServerModels.GetCharacterInventoryRequest;
import GrantItemsToCharacterRequest = PlayFabServerModels.GrantItemsToCharacterRequest;
import UpdateUserInventoryItemDataRequest = PlayFabServerModels.UpdateUserInventoryItemDataRequest;

class InventoryService {
    // TODO: currently we assume that the handler is only used to fetch one character items
    public characterId : string;
    public currentPlayerId : string = currentPlayerId;
    public characterItems : ItemInstance[] | undefined;

    FetchCharacterItems() : void
    {
        if (this.characterItems === undefined)
        {
            let itemsRequest : GetCharacterInventoryRequest = {CharacterId: this.characterId, PlayFabId: this.currentPlayerId};
            let itemsResponse = server.GetCharacterInventory(itemsRequest);
            this.characterItems = itemsResponse.Inventory;
        }
    }

    GrantItemToCharacter(itemId : string) : GrantItemsToCharacterResult
    {
        let itemGrantRequest : GrantItemsToCharacterRequest = {
            CharacterId: this.characterId,
            ItemIds: [],
            PlayFabId: ""
        };
        let itemGrantResult = server.GrantItemsToCharacter(itemGrantRequest);

        if (itemGrantResult.ItemGrantResults !== undefined)
        {
            itemGrantResult.ItemGrantResults.forEach(i => this.characterItems.push(i));
        }

        return itemGrantResult;
    }

    UpdateCharacterItemCustomData(itemInstanceId : string, data : any)
    {
        let customDataUpdateRequest : UpdateUserInventoryItemDataRequest = {
            CharacterId: this.characterId,
            Data: {},
            ItemInstanceId: itemInstanceId,
            PlayFabId: this.currentPlayerId
        };
        server.UpdateUserInventoryItemCustomData(customDataUpdateRequest);
    }

    RemoveCurrencyFromUser(amount : number) : ModifyUserVirtualCurrencyResult
    {
        const subtractRequest : SubtractUserVirtualCurrencyRequest = {
            Amount: amount,
            PlayFabId: this.currentPlayerId,
            VirtualCurrency: ATP_CURRENCY
        };
        return server.SubtractUserVirtualCurrency(subtractRequest);
    }
}

export default InventoryService;