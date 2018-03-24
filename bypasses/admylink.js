document.addEventListener("DOMContentLoaded", function()
{
	let form = document.getElementsByClassName("edit_link");
	if(form.length > 0)
	{
		location.href = form[0].submit();
	}
});
