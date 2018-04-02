document.addEventListener("DOMContentLoaded", function()
{
	var btns = document.querySelectorAll(".btn.btn-primary.btn-block.btn-md, .btn.btn-info.btn-block.btn-md");
	if(btns.length > 0)
	{
		var resultBtns = document.querySelectorAll(".btn.btn-success.btn-block.btn-md");
		if(resultBtns.length > 0)
		{
			location.href = resultBtns[0].getAttribute("href");
		}
		else
		{
			for(var i = 0; i < btns.length; i++)
			{
				let btn = btns[i];
				let onclick = btn.getAttribute("onclick");
				onclick = onclick.replace("location.reload()", "console.trace()");
				eval(onclick);
			}
			location.reload();
		}
	}
});
