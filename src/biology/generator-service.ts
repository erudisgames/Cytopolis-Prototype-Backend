import CharacterInventoryService from "../services/character-inventory-service";
import ServiceLocator from "../utils/service-locator";
import TitleDataService from "../services/title-data-service";
import Constants from "../utils/constants";
import CurrencyService from "../services/currency-service";

class GeneratorService
{
    Claim(GeneratorItemInstanceId : string) : void
    {
        const dataService = <TitleDataService> ServiceLocator.resolve(TitleDataService);
        const invService = <CharacterInventoryService> ServiceLocator.resolve(CharacterInventoryService);

        const generator = invService.characterItems.find(i => i.ItemInstanceId === GeneratorItemInstanceId);
        const generatorTitleData = dataService.generators[generator.ItemId];

        const data = generator.CustomData;
        const value = GeneratorService.getGeneratorValue(data["startTime"], data["limit"] ,data["pace"]);


        if (generatorTitleData.ItemId === Constants.CURRENCY_ATP)
        {
            const currencyService = <CurrencyService> ServiceLocator.resolve(CurrencyService);
            currencyService.Add(value, Constants.CURRENCY_ATP);
        }
        else
        {
            const itemIds = [];
            // TODO: there must be a better way to grant multiple items
            for (let i = 0; i < value; i++)
            {
                itemIds.push(generatorTitleData.ItemId);
            }
            invService.GrantItems(itemIds);
        }

        const customData = { startTime: GeneratorService.nowTimestamp() };
        invService.UpdateItemCustomData(GeneratorItemInstanceId, customData);
    }

    Create(enzymeItemInstanceId : string) : void
    {
        const invService = <CharacterInventoryService> ServiceLocator.resolve(CharacterInventoryService);
        const dataService = <TitleDataService> ServiceLocator.resolve(TitleDataService);

        const enzyme = invService.GetLocalInventoryItem(enzymeItemInstanceId);
        const enzymeTitleData = dataService.enzymes[enzyme.ItemId];
        const generatorTitleData = dataService.generators[enzymeTitleData.GeneratorId];

        const generator = invService.GrantItems([generatorTitleData.Id]);
        const customData = GeneratorService.generateCustomData(generatorTitleData, enzymeItemInstanceId);

        invService.UpdateItemCustomData(generator.ItemGrantResults[0].ItemInstanceId, customData);
    }

    Destroy(enzymeItemInstanceId : string) : void
    {
        const invService = <CharacterInventoryService> ServiceLocator.resolve(CharacterInventoryService);

        const generator = invService.FindItemWithCustomData("generator", "enzymeItemInstanceId", enzymeItemInstanceId);
        invService.RevokeItem({
            CharacterId: invService.characterId,
            ItemInstanceId: generator.ItemInstanceId,
            PlayFabId: currentPlayerId
        });
    }

    static generateCustomData(generatorTitleData : GeneratorTitleData, enzymeItemInstanceId : string) : GeneratorCustomData
    {
        return {
            startTime: GeneratorService.nowTimestamp(),
            limit: generatorTitleData.Limit.toString(),
            pace: generatorTitleData.Pace.toString(),
            resource: generatorTitleData.ItemId,
            enzymeItemInstanceId: enzymeItemInstanceId
        };
    }

    static nowTimestamp() : string
    {
        return Math.floor(Date.now() / 1000).toString();
    }

    static getGeneratorValue(startTimeS : string, limitS : string, paceS : string) : number
    {
        const startTime = parseInt(startTimeS);
        const limit = parseInt(limitS);
        const pace =  parseInt(paceS);
        const stopTime = Math.floor(Date.now() / 1000);

        const seconds =  stopTime - startTime;
        const value = seconds * pace;

        if (value < 1) {
            return 0;
        }

        if (value < limit)
        {
            return value;
        }

        return limit;
    }

}

export default GeneratorService;