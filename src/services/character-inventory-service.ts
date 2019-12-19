import ItemInstance = PlayFabServerModels.ItemInstance;
import GrantItemsToCharacterResult = PlayFabServerModels.GrantItemsToCharacterResult;
import GetCharacterInventoryRequest = PlayFabServerModels.GetCharacterInventoryRequest;
import GrantItemsToCharacterRequest = PlayFabServerModels.GrantItemsToCharacterRequest;
import UpdateUserInventoryItemDataRequest = PlayFabServerModels.UpdateUserInventoryItemDataRequest;
import ConsumeItemRequest = PlayFabServerModels.ConsumeItemRequest;
import ConsumeItemResult = PlayFabServerModels.ConsumeItemResult;
import RevokeInventoryItem = PlayFabServerModels.RevokeInventoryItem;
import RevokeInventoryResult = PlayFabServerModels.RevokeInventoryResult;

class CharacterInventoryService {
    // TODO: currently we assume that the handler is only used to fetch one character items
    public characterId : string;
    public characterItems : ItemInstance[] = [];

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

    RevokeItem(item : RevokeInventoryItem) : RevokeInventoryResult
    {
        const result = server.RevokeInventoryItem(item);

        const revokedItem =- this.characterItems.findIndex(i => i.ItemInstanceId === item.ItemInstanceId);
        this.characterItems = this.characterItems.splice(revokedItem, 1);

        return result;
    }

    ConsumeItems(items: PurchaseCost[]) : ConsumeItemResult[]
    {
        const consumeItemResults : ConsumeItemResult[] = [];
        for (const purchaseCost of items)
        {
            const itemInstanceId = purchaseCost.ItemInstanceId;
            const amount = purchaseCost.Amount;

            const consumeRequest : ConsumeItemRequest = {
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
           if (localItem)
           {
               localItem.RemainingUses = c.RemainingUses;
           }
        });

        return consumeItemResults;
    }

    UpdateItemCustomData(itemInstanceId : string, data : CustomDataInterface) : void
    {
        const stringifyData : { [key: string]: string | null } = {};
        for (const key of Object.getOwnPropertyNames(data))
        {
            // TODO: this is a cheap solution for playfab 20 bytes limits in free tier
            //const value: string = key.includes("InstanceId") ? data[key].slice(0,20) : data[key];
            stringifyData[key] = data[key];
        }

        let customDataUpdateRequest : UpdateUserInventoryItemDataRequest = {
            CharacterId: this.characterId,
            Data: stringifyData,
            ItemInstanceId: itemInstanceId,
            PlayFabId: currentPlayerId
        };
        server.UpdateUserInventoryItemCustomData(customDataUpdateRequest);

        const updatedItem = this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
        if (updatedItem)
        {
            if (updatedItem.CustomData === undefined)
            {
                updatedItem.CustomData = {};
            }
            for (const key of Object.getOwnPropertyNames(data))
            {
                updatedItem.CustomData[key] = data[key];
            }
        }
    }

    GetLocalInventoryItem(itemInstanceId: string) : ItemInstance
    {
        return this.characterItems.find(i => i.ItemInstanceId === itemInstanceId);
    }

    FindItemWithCustomData(itemClass : string, key : string, value : string) : ItemInstance
    {
        const itemsOfType = this.characterItems.filter(i => i.ItemClass === itemClass);
        return itemsOfType.find(i => i.CustomData !== undefined && i.CustomData[key] === value);
    }
}

export default CharacterInventoryService;