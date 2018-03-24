document.addEventListener("DOMContentLoaded", function()
{
	if(document.querySelectorAll(".skip-container").length > 0)
	{
		let form = document.createElement("form");
		form.method = "POST";
		let input = document.createElement("input");
		input.type = "hidden";
		input.name = "_image";
		input.value = "Continue";
		form.appendChild(input);
		form = document.body.appendChild(form);
		form.submit();
	}
});
