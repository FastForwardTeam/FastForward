// This shitty site is delivered over HTTPS but uses the insecure jQuery endpoint in some cases, so we have to unbreak it first. Ain't I nice?
let meta = document.createElement("meta");
meta.setAttribute("http-equiv", "Content-Security-Policy");
meta.setAttribute("content", "upgrade-insecure-requests");
document.head.appendChild(meta);

document.addEventListener("DOMContentLoaded", function()
{
	window.open = function(url)
	{
		location.href = url;
	};
	jQuery.prototype.click = function(func)
	{
		func({"preventDefault":function(){}});
	};
});
