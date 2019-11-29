import TitleDataService from '../src/services/title-data-service';

test('TitleDataService should FetchData properly', () => {
    const titleDataService = new TitleDataService();
    // @ts-ignore
    server.GetTitleData = () => {
        const Data = {
            Enzymes: '{"atp_synthase":{"Name":"ATP_SYNTHASE_NAME"}}'
        };
        return { Data };
    };
    titleDataService.FetchData();
    expect(titleDataService.enzymes['atp_synthase'].Name).toBe('ATP_SYNTHASE_NAME');
});