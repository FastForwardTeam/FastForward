document.addEventListener("DOMContentLoaded", function()
{
	let btn = document.getElementById("btn-main");
	if(btn != null)
	{
		location.href = btn.href;
	}
});
