import ServiceLocator from "../utils/service-locator";
import CharacterInventoryService from "../services/character-inventory-service";
import GeneratorService from "./generator-service";
import Constants from "../utils/constants";
import CurrencyService from "../services/currency-service";

class EnzymeService
{
    Purchase(enzymeId : string, costs : PurchaseCost[], organelleItemInstanceId : string) : void
    {
        const invService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        const currencyService = <CurrencyService>ServiceLocator.resolve(CurrencyService);

        const resourceCosts = costs.filter(c => c.ItemId !== Constants.CURRENCY_ATP);
        const atpCost = costs.find(c => c.ItemInstanceId === Constants.CURRENCY_ATP);
        invService.ConsumeItems(resourceCosts);

        if (atpCost != undefined)
        {
            currencyService.Remove(atpCost.Amount, Constants.CURRENCY_ATP);
        }

        invService.GrantItems([enzymeId]);
        //const enzymeInstanceId = enzyme.ItemGrantResults[0].ItemInstanceId;
        //invService.UpdateItemCustomData(enzymeInstanceId, {orgItemInstanceId: organelleItemInstanceId});

        // update custom data from organelle
        const organelle = invService.GetLocalInventoryItem(organelleItemInstanceId);
        const enzymeCreatedString = organelle.CustomData["enzymesCreated"] || "0";
        const enzymesCreated = parseInt(enzymeCreatedString) + 1;
        invService.UpdateItemCustomData(organelleItemInstanceId, {enzymesCreated: enzymesCreated.toString()});
    }

    Equip(enzymeItemInstanceId : string, organelleItemInstanceId : string) : void
    {
        const invService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        invService.UpdateItemCustomData(enzymeItemInstanceId, {orgItemInstanceId: organelleItemInstanceId});

        const genService = <GeneratorService>ServiceLocator.resolve(GeneratorService);
        genService.Create(enzymeItemInstanceId);
    }

    UnEquip(enzymeItemInstanceId : string) : void
    {
        const invService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        invService.UpdateItemCustomData(enzymeItemInstanceId, {orgItemInstanceId: ""});

        const genService = <GeneratorService>ServiceLocator.resolve(GeneratorService);
        genService.Destroy(enzymeItemInstanceId);
    }
}

export default EnzymeService;