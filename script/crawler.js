// Bevor du fragst, ja ich bin wirklich so behindert und schreibe meinen eigenen Crawler





/**
 * An Class to read and navigate in a HTML file 
 */
class Crawler
{
    /**
     * Selected Element, used for Navigation
     */
    _selected;

    /**
     * Raw input HTML text
     */
    _htmlDoc;

    /** 
     * Input HTML as Document
     */
    _mainElement;



    /**
     * Converts HTML String into DOM Element
     */ 
    static textToElement(text)
    {
        const el = document.createElement( 'html' );
        el.innerHTML = text;
        return el;
    }


    constructor(doc) 
    {    
        this._htmlDoc = doc;
        this.resetSelectedElement();    
    }

    /**
     * Creates or Resets the main Element
     */
    resetMainElement()
    {
        this._mainElement = new Document();
        this._mainElement.appendChild(this._selected);
        console.log(this._mainElement);
    }

    /**
     * Creates or Resets the selectedElement;
     */
     resetSelectedElement()
     {
        this._selected = Crawler.textToElement(this._htmlDoc);
        this.resetMainElement();
     }
 
 

     /**
     * selects an Element by its ID
     * @param id ID of the Element
     */
    selectById(id)
    {
        const wanted = this._selected.querySelector("#" + id);
        if (wanted==null)
        {
            throw "Could not find Element with Id:" + id;
        }
        this._selected = wanted;
    }    

    /** 
     * Selects an Element by its XPath
     * @param {*} path XPath of the Element
     */
     selectElementByXPath(path)
     {
         const wanted =  this._mainElement.evaluate(path, this._mainElement, null, 
                                                XPathResult.FIRST_ORDERED_NODE_TYPE, 
                                                null).singleNodeValue;
         if (wanted==null)
         {
             throw "Could not find Element with Path: " + path;
         }
         this._selected = wanted;
     }

    /** 
     * @param {*} num Nummer des Elements
     */
    selectChildren(num)
    {
        this._selected = this._selected.children[num];
    }



    /** 
     * Returns the Inner HTML of the current selected Element
     */
    getSelectedInnnerHTML()
    {
        return this._selected.innerHTML;
    }

}

/*
var crawler = new Crawler('<html> <head> <title> Test </title> <body> <div id="test"> hallo welt </div> </body> </html>');
//crawler.selectChildren(1);

crawler.selectElementByXPath('//*[@id="test"]');
console.log(crawler.getSelectedInnnerHTML());

*/