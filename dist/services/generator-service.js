import CharacterInventoryService from "./character-inventory-service";
import ServiceLocator from "../utils/service-locator";
import TitleDataService from "./title-data-service";
import Constants from "../utils/constants";
import CurrencyService from "./currency-service";
class GeneratorService {
    Claim(generatorItemInstanceId) {
        const dataService = ServiceLocator.resolve(TitleDataService);
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const generator = invService.characterItems.find(i => i.ItemInstanceId === generatorItemInstanceId);
        const generatorTitleData = dataService.generators.find(g => g.Id === generator.ItemId);
        const data = generator.CustomData;
        const value = GeneratorService.getGeneratorValue(data["startTime"], data["limit"], data["pace"]);
        if (generatorTitleData.ItemId === Constants.CURRENCY_ATP) {
            const currencyService = ServiceLocator.resolve(CurrencyService);
            currencyService.Add(value, Constants.CURRENCY_ATP);
        }
        else {
            const itemIds = [];
            // TODO: there must be a better way to grant multiple items
            for (let i = 0; i < value; i++) {
                itemIds.push(generatorTitleData.ItemId);
            }
            invService.GrantItems(itemIds);
        }
        const customData = { startTime: GeneratorService.nowTimestamp() };
        invService.UpdateItemCustomData(generatorItemInstanceId, customData);
    }
    Create(enzymeItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const dataService = ServiceLocator.resolve(TitleDataService);
        const enzyme = invService.GetLocalInventoryItem(enzymeItemInstanceId);
        const enzymeTitleData = dataService.enzymes.find(e => e.Id === enzyme.ItemId);
        const generatorTitleData = dataService.generators.find(g => g.Id === enzymeTitleData.GeneratorId);
        const generator = invService.GrantItems([enzymeTitleData.Id]);
        const customData = GeneratorService.generateCustomData(generatorTitleData, enzymeItemInstanceId);
        invService.UpdateItemCustomData(generator.ItemGrantResults[0].ItemInstanceId, customData);
    }
    Destroy(enzymeItemInstanceId) {
        const invService = ServiceLocator.resolve(CharacterInventoryService);
        const generator = invService.FindItemWithCustomData("generator", "enzymeItemInstanceId", enzymeItemInstanceId);
        invService.RevokeItem({
            CharacterId: invService.characterId,
            ItemInstanceId: generator.ItemInstanceId,
            PlayFabId: currentPlayerId
        });
    }
    static generateCustomData(generatorTitleData, enzymeItemInstanceId) {
        return {
            startTime: GeneratorService.nowTimestamp(),
            limit: generatorTitleData.Limit.toString(),
            pace: generatorTitleData.Pace.toString(),
            resource: generatorTitleData.ItemId,
            enzymeItemInstanceId: enzymeItemInstanceId
        };
    }
    static nowTimestamp() {
        return Math.floor(Date.now() / 1000).toString();
    }
    static getGeneratorValue(startTimeS, limitS, paceS) {
        const startTime = parseInt(startTimeS);
        const limit = parseInt(limitS);
        const pace = parseInt(paceS);
        const stopTime = Math.floor(Date.now() / 1000);
        const seconds = stopTime - startTime;
        const value = seconds * pace;
        if (value < 1) {
            return 0;
        }
        if (value < limit) {
            return value;
        }
        return limit;
    }
}
export default GeneratorService;
