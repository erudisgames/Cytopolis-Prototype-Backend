import ItemInstance = PlayFabServerModels.ItemInstance;
import GrantItemsToCharacterResult = PlayFabServerModels.GrantItemsToCharacterResult;
import GetCharacterInventoryRequest = PlayFabServerModels.GetCharacterInventoryRequest;
import GrantItemsToCharacterRequest = PlayFabServerModels.GrantItemsToCharacterRequest;
import UpdateUserInventoryItemDataRequest = PlayFabServerModels.UpdateUserInventoryItemDataRequest;
import ConsumeItemRequest = PlayFabServerModels.ConsumeItemRequest;
import ConsumeItemResult = PlayFabServerModels.ConsumeItemResult;

class CharacterInventoryService {
    // TODO: currently we assume that the handler is only used to fetch one character items
    public characterId : string;
    public characterItems : ItemInstance[] | undefined;

    FetchItems() : void
    {
        let itemsRequest : GetCharacterInventoryRequest = {CharacterId: this.characterId, PlayFabId: currentPlayerId};
        let itemsResponse = server.GetCharacterInventory(itemsRequest);
        this.characterItems = itemsResponse.Inventory;
    }

    GrantItems(itemIds : string[]) : GrantItemsToCharacterResult
    {
        const itemsGrantRequest : GrantItemsToCharacterRequest = {
            CharacterId: this.characterId,
            ItemIds: itemIds,
            PlayFabId: currentPlayerId
        };
        const itemsGrantResult = server.GrantItemsToCharacter(itemsGrantRequest);

        if (itemsGrantResult.ItemGrantResults !== undefined)
        {
            itemsGrantResult.ItemGrantResults.forEach(i => this.characterItems.push(i));
        }

        return itemsGrantResult;
    }

    ConsumeItems(items: {[key: string]: number}) : ConsumeItemResult[]
    {
        const consumeItemResults : ConsumeItemResult[] = [];
        for (const key in items)
        {
            const itemInstanceId = key;
            const amount = items[key];

            const consumeRequest : ConsumeItemRequest = {
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

    UpdateItemCustomData(itemInstanceId : string, data : { [key: string]: string }) : void
    {
        let customDataUpdateRequest : UpdateUserInventoryItemDataRequest = {
            CharacterId: this.characterId,
            Data: data,
            ItemInstanceId: itemInstanceId,
            PlayFabId: currentPlayerId
        };
        server.UpdateUserInventoryItemCustomData(customDataUpdateRequest);

        const updatedItem = this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
        for (const key in data)
        {
            updatedItem.CustomData[key] = data[key];
        }
    }

    GetLocalInventoryItem(itemInstanceId: string) : ItemInstance
    {
        return this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
    }
}

export default CharacterInventoryService;