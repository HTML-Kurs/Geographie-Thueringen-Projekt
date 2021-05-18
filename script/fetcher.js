const KreisMap = new Map();

function loadKreisMap()
{
    let doc = loadData("./php/getWebsite.php", ["site=statistik.thueringen.de/datenbank/oertlich.asp?auswahl=krs"]);

    let crawler = new Crawler(doc);
    let counter = 0;
    while (true)
    {
        crawler.resetSelectedElement();
        crawler.selectElementByXPath("/html/body/div[4]/form/table/tbody");
        try
        {
            crawler.selectChildren( counter);
            crawler.selectChildren( 0);
            crawler.selectChildren( 0);
            let f = crawler.getSelectedInnnerHTML().replace(/\&nbsp;/g, "").replace(/<dfn>/g, "").replace(/<\/dfn>/g, "").replace(/\./g, "");
            let land = f.replace(/[0-9]/g, "");
            let number = parseInt(f.replace(/[a-z]/g, ""));
            KreisMap.set(land, number)
            counter ++;
        }
        catch 
        {
            break;
        }
       
    }
    
}

loadKreisMap();

console.log(KreisMap)

