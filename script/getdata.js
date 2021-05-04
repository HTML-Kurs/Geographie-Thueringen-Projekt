

// doc = document was aufgerufen wird
// args = Argument -> in der Array Form: ["Argument=Wert", ""]
function loadData(doc, args=[])
{
	const oArgs = args.join("&");
	var request = new XMLHttpRequest();
    request.open('POST', doc , false);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(oArgs);
	return request.responseText.replace(/__AMP__/g, "&");
}



function loadJson(doc, args)
{
	return JSON.parse(loadData(doc, args));
}
