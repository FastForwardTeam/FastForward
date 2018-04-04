document.addEventListener("DOMContentLoaded", function()
{
	var btn = document.getElementsByClassName("redirect");
	if(btn.length > 0)
	{
		if(btn[0].hasAttribute("href") && btn[0].href.substr(0, 1) != "#")
		{
			location.href = btn[0].href;
		}
	}
});
