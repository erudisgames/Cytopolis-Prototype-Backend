import CharacterInventoryService from "./character-inventory-service";
import ServiceLocator from "../utils/service-locator";
import CurrencyService from "./currency-service";
import Constants from "../utils/constants";
class OrganelleService {
    Purchase(organelleId, atpPrice) {
        // TODO: verify with titleData & inventory to ensure player can purchase it
        const currencyService = ServiceLocator.resolve(CurrencyService);
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        if (atpPrice > 0) {
            currencyService.Remove(atpPrice, Constants.CURRENCY_ATP);
        }
        inventoryService.GrantItems([organelleId]);
    }
    Equip(itemInstanceId, posX, posY) {
        // TODO: do some verifications like ensuring tile is available
        const inventoryService = ServiceLocator.resolve(CharacterInventoryService);
        const enzymesCreated = "0";
        inventoryService.UpdateItemCustomData(itemInstanceId, { enzymesCreated, posX, posY });
    }
}
export default OrganelleService;
