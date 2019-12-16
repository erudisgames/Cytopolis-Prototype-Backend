import CharacterInventoryService from "../services/character-inventory-service";
import ServiceLocator from "../utils/service-locator";
import CurrencyService from "../services/currency-service";
import Constants from "../utils/constants";
import EnzymeService from "./enzyme-service";

class OrganelleService
{
    Purchase(organelleId : string, atpPrice : number) : void
    {
        // TODO: verify with titleData & inventory to ensure player can purchase it
        const currencyService = <CurrencyService>ServiceLocator.resolve(CurrencyService);
        const inventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);

        if (atpPrice > 0)
        {
            currencyService.Remove(atpPrice, Constants.CURRENCY_ATP);
        }
        inventoryService.GrantItems([organelleId]);
    }

    Equip(itemInstanceId : string, posX : string, posY : string) : void
    {
        // TODO: do some verifications like ensuring tile is available
        const inventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        const enzymesCreated = "0";
        const level = "1";
        inventoryService.UpdateItemCustomData(itemInstanceId, { enzymesCreated, level, posX, posY });
    }

    LevelUp(itemInstanceId : string, atpPrice : number) : void
    {
        const currencyService = <CurrencyService>ServiceLocator.resolve(CurrencyService);
        const inventoryService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);

        const organelle = inventoryService.GetLocalInventoryItem(itemInstanceId);
        const level = (Number(organelle.CustomData["level"]) + 1).toString();

        inventoryService.UpdateItemCustomData(itemInstanceId, {level});

        if (atpPrice > 0)
        {
            currencyService.Remove(atpPrice, Constants.CURRENCY_ATP);
        }

        const enzymeService = <EnzymeService>ServiceLocator.resolve(EnzymeService);
        const equippedEnzyme = inventoryService.FindItemWithCustomData("enzyme", "enzymeItemInstanceId", itemInstanceId);
        if (!equippedEnzyme)
        {
            return;
        }

        enzymeService.UnEquip(equippedEnzyme.ItemInstanceId);
    }
}

export default OrganelleService;