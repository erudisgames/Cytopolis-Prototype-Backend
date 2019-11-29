import CharacterService from '../src/services/character-service';

test('CharacterService should have a method named createCharacter', () => {
    const characterService = new CharacterService();
    expect(characterService.Create).toBeTruthy();
});