import ModifyUserVirtualCurrencyResult = PlayFabServerModels.ModifyUserVirtualCurrencyResult;
import SubtractUserVirtualCurrencyRequest = PlayFabServerModels.SubtractUserVirtualCurrencyRequest;
import AddUserVirtualCurrencyRequest = PlayFabServerModels.AddUserVirtualCurrencyRequest;

class CurrencyService {

    Remove(amount : number, type : string) : ModifyUserVirtualCurrencyResult
    {
        const subtractRequest : SubtractUserVirtualCurrencyRequest = {
            Amount: amount,
            PlayFabId: currentPlayerId,
            VirtualCurrency: type
        };
        return server.SubtractUserVirtualCurrency(subtractRequest);
    }

    Add(amount : number, type : string) : ModifyUserVirtualCurrencyResult
    {
        const request : AddUserVirtualCurrencyRequest = {
            Amount: amount,
            PlayFabId: currentPlayerId,
            VirtualCurrency: type};
        return server.AddUserVirtualCurrency(request);
    }
}

export default CurrencyService;