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

    JoinToClan(characterId : string, sharedGroupId : string): PlayFabServerModels.AddSharedGroupMembersResult
    {
        const request = {
            Members: [{
                Id: characterId,
                Type: "character"
            }],
            Group: {
                Id: sharedGroupId,
                Type: "group"
            }
        };

        return entity.AddMembers(request);
    }
}

export default CharacterService;