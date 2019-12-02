import CharacterInventoryService from '../src/services/character-inventory-service';

test('CharacterInventoryService should have a method named FetchItems', () => {
    const characterInventoryService = new CharacterInventoryService();
    expect(characterInventoryService.FetchItems).toBeTruthy();
});

test('CharacterInventoryService should call servers UpdateUserInventoryItemCustomData correctly', () => {
    const INSTANCE_ID = 'ITEM_INSTANCE_ID';
    const START_TIME = '777';
    const characterInventoryService = new CharacterInventoryService();
    // @ts-ignore
    server.UpdateUserInventoryItemCustomData = (request => {
        expect(request.ItemInstanceId).toBe(INSTANCE_ID);
        expect(request.Data.startTime).toBe(START_TIME);
        return null;
    });
    characterInventoryService.UpdateItemCustomData(INSTANCE_ID, {startTime: START_TIME});
    // @ts-ignore
    delete server.UpdateUserInventoryItemCustomData;
});

test('CharacterInventoryService should return a correct item when calling FindItemWithCustomData', () => {
    const characterInventoryService = new CharacterInventoryService();
    characterInventoryService.characterItems = [{ItemInstanceId: '777', UnitPrice: 0, ItemId: 'generator', CustomData: {DataId: '666'}}];
    const item = characterInventoryService.FindItemWithCustomData('generator', 'DataId', '666');
    expect(item.ItemInstanceId).toBe('777');
});