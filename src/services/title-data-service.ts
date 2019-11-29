class TitleDataService
{
    public generators : GeneratorTitleData[];
    public enzymes : EnzymeTitleData[];

    public Fetch() : void
    {
        // TODO: fetch organelles
        const request = { Keys: ["Enzymes", "Generators"] };
        const result = server.GetTitleData(request);

        if (result.Data.hasOwnProperty("Generators"))
        {
            this.generators = JSON.parse(result.Data["Generators"]);
        }

        if (result.Data.hasOwnProperty("Enzymes"))
        {
            this.enzymes = JSON.parse(result.Data["Enzymes"]);
        }
    }
}

export default TitleDataService;