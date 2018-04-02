Object.defineProperty(window, "countdown", {
	value: 0,
	writable: false
});
Object.defineProperty(window, "rr", {
	set: function(func)
	{
		func();
		if(document.querySelectorAll(".skip > .btn").length > 0)
		{
			document.querySelectorAll(".skip > .btn")[0].click();
		}
	},
	get: function()
	{
		return function(){};
	}
});
