var query = location.search.toString().replace("?", "");
if(query.substr(0, 7) == "target=")
{
	location.href = "http://dl.ccbluex.net/download/index.php?file=" + query.substr(7);
}
