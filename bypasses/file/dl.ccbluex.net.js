var search = location.search.toString().replace("?", "");
if(search.substr(0, 7) == "target=")
{
	location.href = "http://dl.ccbluex.net/download/index.php?file=" + search.substr(7);
}
