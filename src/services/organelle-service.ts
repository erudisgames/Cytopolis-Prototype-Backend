import CharacterInventoryService from "./character-inventory-service";
import ServiceLocator from "../utils/service-locator";
import CurrencyService from "./currency-service";

class OrganelleService
{
    Purchase(organelleId : string, atpPrice : number) : void
    {
        // TODO: verify with titleData & inventory to ensure player can purchase it
        const currencyService = <CurrencyService>ServiceLocator.resolve(CurrencyService);
        const inventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);

        currencyService.Remove(atpPrice, CURRENCY_ATP);
        inventoryService.GrantItems([organelleId]);
    }

    Equip(itemInstanceId : string, posX : string, posY : string) : void
    {
        // TODO: do some verifications like ensuring tile is available
        const inventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        inventoryService.UpdateItemCustomData(itemInstanceId, { posX, posY });
    }
}

export default OrganelleService;