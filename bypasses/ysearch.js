document.addEventListener("DOMContentLoaded", function()
{
	let btn = document.getElementById("NextVideo");
	if(btn != null)
	{
		location.href = btn.href;
	}
});
