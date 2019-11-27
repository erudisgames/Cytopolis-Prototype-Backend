import ModifyUserVirtualCurrencyResult = PlayFabServerModels.ModifyUserVirtualCurrencyResult;
import SubtractUserVirtualCurrencyRequest = PlayFabServerModels.SubtractUserVirtualCurrencyRequest;

class CurrencyService {
    public currentPlayerId : string = currentPlayerId;

    Remove(amount : number, type : string) : ModifyUserVirtualCurrencyResult
    {
        const subtractRequest : SubtractUserVirtualCurrencyRequest = {
            Amount: amount,
            PlayFabId: this.currentPlayerId,
            VirtualCurrency: type
        };
        return server.SubtractUserVirtualCurrency(subtractRequest);
    }
}

export default CurrencyService;