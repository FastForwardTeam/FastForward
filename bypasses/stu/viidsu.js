document.addEventListener("DOMContentLoaded", function()
{
	var btn = document.getElementById("link-success-button");
	if(btn != null)
	{
		if(btn.getAttribute("data-url") != null)
		{
			location.href = btn.getAttribute("data-url");
		}
	}
});
