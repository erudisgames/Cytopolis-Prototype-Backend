class TitleDataService
{
    public enzymes : { [key: string]: EnzymeTitleData } = {};
    public generators : { [key: string]: GeneratorTitleData } = {};

    public FetchData() : void
    {
        // TODO: fetch organelles
        const titleDataRequest = { "Keys": ["Enzymes", "Generators"] };
        const titleDataResult = server.GetTitleData(titleDataRequest);

        // TODO: abstract mechanisim
        if (titleDataResult.Data.hasOwnProperty("Enzymes"))
        {
            this.enzymes = JSON.parse(titleDataResult.Data["Enzymes"]);
        }

        if (titleDataResult.Data.hasOwnProperty("Generators"))
        {
            this.generators = JSON.parse(titleDataResult.Data["Generators"]);
        }
    }
}

export default TitleDataService;