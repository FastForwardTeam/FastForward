document.addEventListener("DOMContentLoaded", function()
{
	let btn = document.querySelectorAll("[data-download]");
	if(btn.length > 0)
	{
		location.href = btn[0].getAttribute("data-download");
	}
});
