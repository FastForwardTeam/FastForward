Object.defineProperty(window, "adblock", {
	value: false,
	writable: false
});
Object.defineProperty(window, "i", {
	value: 0,
	writable: false
});
document.addEventListener("DOMContentLoaded", function()
{
	let link_timer = window.setInterval(function()
	{
		if(document.querySelectorAll(".next[href]").length > 0)
		{
			window.clearInterval(link_timer);
			location.href = atob(atob(document.querySelectorAll(".next[href]")[0].getAttribute("href")));
		}
	}, 100);
});
