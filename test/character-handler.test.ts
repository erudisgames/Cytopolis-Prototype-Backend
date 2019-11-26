import CharacterHandler from '../src/_character-handler';

test('CharacterHandler should have a static method named createCharacter', () => {
    const characterHandler = new CharacterHandler();
    expect(characterHandler.CreateCharacter).toBeTruthy();
});