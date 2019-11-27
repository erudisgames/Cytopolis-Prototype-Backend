import CharacterService from '../src/services/character-service';

test('CharacterService should have a static method named createCharacter', () => {
    const characterHandler = new CharacterService();
    expect(characterHandler.Create).toBeTruthy();
});