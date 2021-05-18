const KreisMap = new Map();

function loadKreisMap()
{
    let doc = loadData("./php/getWebsite.php", ["site=statistik.thueringen.de/datenbank/oertlich.asp?auswahl=krs"]);

    let crawler = new Crawler(doc);

    while (true)
    {
        crawler.resetSelectedElement();
        crawler.selectElementByXPath("/html/body/div[4]/form/table/tbody");
       
        break;
    }
    
}

loadKreisMap();


