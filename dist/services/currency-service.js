class CurrencyService {
    Remove(amount, type) {
        const subtractRequest = {
            Amount: amount,
            PlayFabId: currentPlayerId,
            VirtualCurrency: type
        };
        return server.SubtractUserVirtualCurrency(subtractRequest);
    }
    Add(amount, type) {
        const request = {
            Amount: amount,
            PlayFabId: currentPlayerId,
            VirtualCurrency: type
        };
        return server.AddUserVirtualCurrency(request);
    }
}
export default CurrencyService;
