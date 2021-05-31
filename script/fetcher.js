const KreisNumberMap = new Map();
const KreisCache = new Map();

/**
 * Verbindet jeden Kreis mit seiner zugehörigen Kreisnummer in der API
 */
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
            let land = f.replace(/[0-9]/g, "").replace(/Stadt /, "");
            let number = parseInt(f.replace(/[a-z]/g, ""));
            KreisNumberMap.set(land, number)
            counter ++;
        }
        catch 
        {
            break;
        }
       
    }
    
}

loadKreisMap();

console.log(KreisNumberMap)





const LoadKreisTemplate = "statistik.thueringen.de/datenbank/portrait.asp?auswahl=krs&nr=[NR]&vonbis=&TabelleID=kr000108"
/**
 * Lädt Einwohner für bestimmten Kreis
 * @param {*} name Name des Kreises
 * @returns [Jahreszahlen: [1940, 1941, ...], Einwohnerzahlen: [30000, 30500, ...]]
 */
function loadKreisByName(name, loadCache=true)
{

    if (loadCache && KreisCache.has(name))
    {
        return KreisCache.get(name);
    }

    if (name=="Thueringen")
    {
        ret = loadThur();
        if (loadCache && !KreisCache.has(name))
        {
            KreisCache.set(name ,ret);
        }
        return ret
    }
    



    let kreis = KreisNumberMap.get(name);
    let url = LoadKreisTemplate.replace(/\[NR\]/, kreis);
    let doc = loadData("./php/getWebsite.php", ["site="+url]);
    
    let crawler = new Crawler(doc);
    let Jahre = [];
    let Bevoelkerung = [];
    var i = 0;
    while (true)
    {
        try 
        {
            crawler.resetSelectedElement()
            crawler.selectElementByXPath("/html/body/div[4]/table/tbody/tr[7]")
            crawler.selectChildren(i)
            let number = parseInt(crawler.getSelectedInnnerHTML().replace(/[a-z],0/g, ""));
            crawler.resetSelectedElement()
            crawler.selectElementByXPath("/html/body/div[4]/table/tbody/tr[8]")
            crawler.selectChildren(i)
            let bev = parseInt(crawler.getSelectedInnnerHTML().replace(/&|<|\/|>|;/g, "").replace(/[a-z]/g, ""));

            if (!isNaN(number) && !isNaN(bev))
            {
                Bevoelkerung.push(bev)
                Jahre.push(number)
            }
            i++;
        }
        catch (e)
        {
            console.log(e)
            break;
        }
    }

    if (loadCache && !KreisCache.has(name))
    {
        KreisCache.set(name ,[Jahre, Bevoelkerung]);
    }
    return [Jahre, Bevoelkerung]
    
}



const LoadThurTemplate = "statistik.thueringen.de/datenbank/portrait-zeitreihe.asp?tabelle=zr000101"
/**
 * Lädt Einwohner von gnaz Thüringen
 * @returns [Jahreszahlen: [1940, 1941, ...], Einwohnerzahlen: [30000, 30500, ...]]
 */
function loadThur()
{
    let doc = loadData("./php/getWebsite.php", ["site="+LoadThurTemplate]);
    
    let crawler = new Crawler(doc);
    let Jahre = [];
    let Bevoelkerung = [];
    var i = 0;
    while (true)
    {
        try 
        {
            crawler.resetSelectedElement()
            crawler.selectElementByXPath("/html/body/div[4]/table/thead/tr")
            crawler.selectChildren(i)
            let number = parseInt(crawler.getSelectedInnnerHTML().replace(/[a-z],0/g, ""));
            crawler.resetSelectedElement()
            crawler.selectElementByXPath("/html/body/div[4]/table/tbody/tr[1]")
            crawler.selectChildren(i+1)
            let bev = parseInt(crawler.getSelectedInnnerHTML().replace(/&|<|\/|>|;/g, "").replace(/[a-z]/g, ""));

            if (!isNaN(number) && !isNaN(bev))
            {
                Bevoelkerung.push(bev)
                Jahre.push(number)
            }
            i++;
        }
        catch (e)
        {
            console.log(e)
            break;
        }
    }
    return [Jahre, Bevoelkerung]
}