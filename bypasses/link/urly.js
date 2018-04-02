document.addEventListener("DOMContentLoaded", function()
{
	if(location.pathname.length > 2)
	{
		location.href = "/goii/" + location.pathname.substr(2) + "?ref=" + location.hostname + location.pathname;
	}
});
