import ServiceLocator from "../utils/service-locator";
import CharacterInventoryService from "../services/character-inventory-service";
import GeneratorService from "./generator-service";

class EnzymeService
{
    Purchase(enzymeId : string, costs : PurchaseCost[], organelleItemInstanceId : string) : void
    {
        const invService = <CharacterInventoryService>ServiceLocator.resolve(CharacterInventoryService);
        invService.ConsumeItems(costs);
        invService.GrantItems([enzymeId]);
        //const enzymeInstanceId = enzyme.ItemGrantResults[0].ItemInstanceId;
        //invService.UpdateItemCustomData(enzymeInstanceId, {orgItemInstanceId: organelleItemInstanceId});

        // update custom data from organelle
        const organelle = invService.GetLocalInventoryItem(organelleItemInstanceId);
        const enzymeCreatedString = organelle.CustomData["enzymesCreated"] || "0";
        const enzymesCreated = parseInt(enzymeCreatedString) + 1;
        log.info(enzymesCreated.toString());
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