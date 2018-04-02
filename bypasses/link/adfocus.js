document.addEventListener("DOMContentLoaded", function()
{
	let btn = document.getElementsByClassName("skip");
	if(btn.length > 0)
	{
		location.href = btn[0].href;
	}
});
