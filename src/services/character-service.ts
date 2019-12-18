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
            PlayFabIds: [characterId],
            SharedGroupId: sharedGroupId
        };

        return server.AddSharedGroupMembers(request);
    }
}

export default CharacterService;