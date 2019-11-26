import ItemInstance = PlayFabServerModels.ItemInstance;
import GrantItemsToCharacterResult = PlayFabServerModels.GrantItemsToCharacterResult;
import ModifyUserVirtualCurrencyResult = PlayFabServerModels.ModifyUserVirtualCurrencyResult;
import SubtractUserVirtualCurrencyRequest = PlayFabServerModels.SubtractUserVirtualCurrencyRequest;

class InventoryHandler {
    characterItems : ItemInstance[];

    FetchCharacterItems(characterId : string) : void
    {

    }

    GrantItemToCharacter(characterId : string, itemId : string) : GrantItemsToCharacterResult
    {
        return null;
    }

    RemoveCurrencyFromUser(amount : number) : ModifyUserVirtualCurrencyResult
    {
        const subtractRequest : SubtractUserVirtualCurrencyRequest = {
            Amount: amount,
            PlayFabId: currentPlayerId,
            VirtualCurrency: ATP_CURRENCY
        };
        return server.SubtractUserVirtualCurrency(subtractRequest);
    }
}

export default InventoryHandler;