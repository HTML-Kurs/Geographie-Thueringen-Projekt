const KreisNumberMap = new Map();
const KreisCache = new Map();

var NAME_KREIS = "No Input";
const docN = loadData("./php/getWebsite.php", ["site=statistik.thueringen.de/datenbank/oertlich.asp?auswahl=krs"]);
// console.log(dog)

/**
 * Verbindet jeden Kreis mit seiner zugehörigen Kreisnummer in der API
 */
 function loadData(doc, args=[])
 {
     const oArgs = args.join("&");
     var request = new XMLHttpRequest();
     request.open('GET', doc + "?" + oArgs.replace(/\?/, "[QUEST]").replace(/\&/, "[AND]"), false);
     request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
     
     request.send();
     console.log(`request: \n  \n  \n ${request.responseText}`)
     return request.responseText;
 }
 

function loadKreisMap()
{
    let crawler = new Crawler(docN);
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
            console.log(KreisNumberMap);
            break;
        }
       
    }
    
}

loadKreisMap();

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
        console.log(KreisCache)
        console.log("used CACHE")
        //return KreisCache.get(name);
        chart_IT(KreisCache.get(name));
        return; 
    }
    console.log("FINE")
    let kreis = KreisNumberMap.get(name);
    let url = LoadKreisTemplate.replace(/\[NR\]/, kreis);
    let doc = loadData("./php/getWebsite.php", ["site="+url]);

    let crawler = new Crawler(doc);
    let Jahre = [];
    let Bevoelkerung = [];
    var i = 0;

    // tabelle geht bis 29 r now 
    while (i < 29)
    {
        try 
        {
            console.log("called");
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

                
                Jahre = xs;
                Bevoelkerung = ys;
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
        KreisCache.set(name ,{xs, ys});
    }
    
    console.log("draw")
    chart_IT({xs, ys});
}

let Jahre = [];
let Bevoelkerung = [];
var xs = Jahre;      
var ys = Bevoelkerung;

let J = [];
let B = [];
const LoadThurTemplate = "statistik.thueringen.de/datenbank/portrait-zeitreihe.asp?tabelle=zr000101"
/**
 * Lädt Einwohner von ganz Thüringen
 * @returns [Jahreszahlen: [1940, 1941, ...], Einwohnerzahlen: [30000, 30500, ...]]
 */

function loadThur()
{
    let doc = loadData("./php/getWebsite.php", ["site="+LoadThurTemplate]);
    console.log(`doc: ${doc}`);
    let crawler = new Crawler(doc);
    console.log(`crawler: ${crawler}`);
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
                B.push(bev)
                J.push(number)
                
            }
            i++;
            
        }
        catch (e)
        {
            console.log(e)
            break;
        }
    }
    console.log("draw")
    return {J, B}
}

      
function chart_IT(dataKREIS){       
    if (NAME_KREIS == "Kyffh�userkreis"){
        NAME_KREIS = "Kyffhäuserkreis";
    }
    else if (NAME_KREIS == "S�mmerda"){

        NAME_KREIS = "Sömmerda";
    }   
    const ctx = document.getElementById('chart').getContext('2d');
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataKREIS.xs,
            datasets: [{
                label: `Einwohner-Diagramm: ${NAME_KREIS}` ,
                data: dataKREIS.ys,
                fill: false,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                }]
            }
        }
     });
    xs = [];
    ys = [];
}

function THchart_IT(){               

    const dataTH = loadThur();
    const el =   document.getElementById('chart').getContext('2d');
    const ThueringenChart = new Chart(el, {
        type: 'line',
        data: {
            labels: dataTH.J,
            datasets: [{
                label: `Einwohner Thüringen`,
                data: dataTH.B,
                fill: false,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                }]
            }
        }
     });
     
}
