class CharacterHandler
{
    CreateCharacter(characterName : string): void {
        const grantCharRequest = {
            PlayFabId: currentPlayerId,
            CharacterName: characterName,
            CharacterType: "Cell"
        };
        server.GrantCharacterToUser(grantCharRequest);
    }
}

export default CharacterHandler;