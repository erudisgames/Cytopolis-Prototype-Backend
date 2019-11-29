import CharacterInventoryService from '../src/services/character-inventory-service';

test('CharacterInventoryService should have a method named FetchItems', () => {
    const characterHandler = new CharacterInventoryService();
    expect(characterHandler.FetchItems).toBeTruthy();
});

test('CharacterInventoryService should call servers UpdateUserInventoryItemCustomData correctly', () => {
    const INSTANCE_ID = 'ITEM_INSTANCE_ID';
    const START_TIME = '777';
    const characterHandler = new CharacterInventoryService();
    // @ts-ignore
    server.UpdateUserInventoryItemCustomData = (request => {
        expect(request.ItemInstanceId).toBe(INSTANCE_ID);
        expect(request.Data.startTime).toBe(START_TIME);
        return null;
    });
    characterHandler.UpdateItemCustomData(INSTANCE_ID, {startTime: START_TIME});
});