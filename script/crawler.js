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
        var wrapper= document.createElement('html');
        wrapper.innerHTML= text;
        return wrapper;
    }


    constructor(doc) 
    {    
        this._htmlDoc = doc;
        this.resetSelectedElement();  
        this.resetMainElement();
        
    }

    /**
     * Creates or Resets the main Element
     */
    resetMainElement()
    {
        this._mainElement = Crawler.textToElement(this._htmlDoc);;
    }

    /**
     * Creates or Resets the selectedElement;
     */
     resetSelectedElement()
     {
        this._selected = Crawler.textToElement(this._htmlDoc);
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
    
    selectChildrenByTag(tag)
    {
        let g = tag.split("[");
        let t = g[0].toUpperCase();
        if (g.length==2)
        {
            let number = parseInt(tag.split("[")[1].replace(/\]/, ""));
            var current = 0;
            for (var el of this._selected.children)
            {
                if (el.tagName==t)
                {
                    current++;
                    if (current == number)
                    {
                        this._selected = el;
                        return;
                    }
                }
            }
            throw "Could not find Element with tag:" + t;
        }
        else
        {
            for (var el of this._selected.children)
            {
                console.log(el.tagName + " ?? " + t)
                if (el.tagName==t)
                {
                    this._selected = el;
                    return; 
                }
            }
            throw "Could not find Element with tag:" + tag;
        }
    }  

   

    /** 
     * Selects an Element by its XPath
     * @param {*} path XPath of the Element
     */
     selectElementByXPath(path)
     {
        const search =  path.toString().split("/");
        search.shift();
        search.forEach(element => {
            if (element!="html") {
            this.selectChildrenByTag(element)  
            }
        });
        console.log(this._selected);
     }


    /** 
     * @param {*} num Nummer des Elements
     */
    selectChildren(num)
    {
        this._selected = this._selected.children[num];
    }

    selectParent()
    {
        const wanted = this._selected.parent;
        if (wanted==null)
        {
            throw "Could not find the paretn of selected Object";
        }
        this._selected = wanted;
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