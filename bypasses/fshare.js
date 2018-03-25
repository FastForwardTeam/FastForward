document.addEventListener("DOMContentLoaded", function()
{
	let form = $("#form-download");
	if(form.length > 0)
	{
		$.ajax({
			"url": form.attr("action"),
			"type": "POST",
			"data": $("#form-download").serialize()
		}).done(function(data)
		{
			location.href = data.url;
		});
	}
});
