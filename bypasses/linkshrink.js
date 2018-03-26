window.open = function(){};
document.addEventListener("DOMContentLoaded", function()
{
	window.setTimeout(function()
	{
		let btn = document.getElementById("btd");
		if(btn != null)
		{
			btn.click();
		}
	}, 100);
});
