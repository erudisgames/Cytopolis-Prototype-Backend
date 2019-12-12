class CharacterService
{
    Create(characterName : string): PlayFabServerModels.GrantCharacterToUserResult {
        const grantCharRequest = {
            PlayFabId: currentPlayerId,
            CharacterName: characterName,
            CharacterType: "Cell"
        };
        return server.GrantCharacterToUser(grantCharRequest);
    }
}

export default CharacterService;