document.addEventListener("DOMContentLoaded", function()
{
	if(document.getElementById("pay_modes") != null)
	{
		let form = document.createElement("form");
		form.method = "POST";
		form.innerHTML = '<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.toString().substr(1)+'"><input type="hidden" name="fname" value="'+document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent+'"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">';
		form = document.body.appendChild(form);
		form.submit();
	}
	else if(document.getElementById("btn_download") != null)
	{
		document.getElementById("btn_download").click();
	}
});
