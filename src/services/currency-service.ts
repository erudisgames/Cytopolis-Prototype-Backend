import ModifyUserVirtualCurrencyResult = PlayFabServerModels.ModifyUserVirtualCurrencyResult;
import SubtractUserVirtualCurrencyRequest = PlayFabServerModels.SubtractUserVirtualCurrencyRequest;

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
}

export default CurrencyService;