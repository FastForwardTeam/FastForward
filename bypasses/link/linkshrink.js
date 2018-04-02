document.addEventListener("DOMContentLoaded", function()
{
	let pauseDiv = document.getElementById("pause");
	if(pauseDiv != null)
	{
		pauseDiv.style.display = "none";
	}
	let skipDiv = document.getElementById("skip");
	if(skipDiv != null)
	{
		skipDiv.style.display = "block";
	}
});
