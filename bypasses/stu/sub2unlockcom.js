document.addEventListener("DOMContentLoaded", function()
{
	$(document).ready(function()
	{
		var steps = document.querySelectorAll(".uk.unlock-step-link.check");
		if(steps.length > 0)
		{
			for(let i in steps)
			{
				if(i != 0 && steps[i] instanceof HTMLElement)
				{
					if(steps[i].className.substr(0, 3) == "uk ")
					{
						steps[i].className = steps[i].className.substr(3);
					}
				}
			}
			steps[0].removeAttribute("target");
			steps[0].setAttribute("href", "#");
			steps[0].click();
			document.getElementById("link").click();
		}
	});
});
