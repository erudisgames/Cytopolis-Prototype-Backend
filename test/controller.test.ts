import Controller from '../src/controller';

test('controller should have a method named createCharacter', () => {
    const controller = new Controller();
    expect(controller.CreateCharacter).toBeTruthy();
});