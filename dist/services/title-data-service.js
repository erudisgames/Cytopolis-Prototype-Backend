class TitleDataService {
    FetchData() {
        // TODO: fetch organelles
        const titleDataRequest = { "Keys": ["Enzymes", "Generators"] };
        const titleDataResult = server.GetTitleData(titleDataRequest);
        if (titleDataResult.Data.hasOwnProperty("Generators")) {
            this.generators = JSON.parse(titleDataResult.Data["Generators"]);
        }
        if (titleDataResult.Data.hasOwnProperty("Enzymes")) {
            this.enzymes = JSON.parse(titleDataResult.Data["Enzymes"]);
        }
    }
}
export default TitleDataService;
