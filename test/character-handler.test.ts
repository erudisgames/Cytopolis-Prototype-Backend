import CharacterService from '../src/character-service';

test('CharacterService should have a static method named createCharacter', () => {
    const characterHandler = new CharacterService();
    expect(characterHandler.CreateCharacter).toBeTruthy();
});