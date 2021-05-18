

// doc = document was aufgerufen wird
// args = Argument -> in der Array Form: ["Argument=Wert", ""]
function loadData(doc, args=[])
{
	const oArgs = args.join("&");
	var request = new XMLHttpRequest();
    request.open('GET', doc + "?" + oArgs.replace(/\?/, "[QUEST]").replace(/\&/, "[AND]"), false);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send();
	return request.responseText;
}

