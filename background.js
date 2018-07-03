chrome.runtime.onInstalled.addListener((details)=>{
	if(details.reason=="install")
		window.open(chrome.extension.getURL("/html/firstrun.html"))
})
chrome.runtime.setUninstallURL("https://goo.gl/forms/H8FswYQ2a37LSxc13")

chrome.webRequest.onBeforeRequest.addListener((details)=>{
	if(details.type!="main_frame")
		return
	let destination
	if(/goo\.gl\/.+/.test(details.url))
	{
		let xhr=new XMLHttpRequest()
		xhr.onreadystatechange=()=>{
			if(xhr.readyState==4&&xhr.status==200)
			{
				let json=JSON.parse(xhr.responseText)
				if(json&&json.longUrl)
					destination=json.longUrl
			}
		}
		xhr.open("GET","https://www.googleapis.com/urlshortener/v1/url?shortUrl="+details.url+"&key=AIzaSyCw_sp3-x3gMjrYYJL7x_leh0QSQ0WYjng",false)
		xhr.send()
	}
	else if(/bit\.ly\/.+/.test(details.url))
	{
		let xhr=new XMLHttpRequest()
		xhr.onreadystatechange=()=>{
			if(xhr.readyState==4&&xhr.status==200)
			{
				let json=JSON.parse(xhr.responseText)
				if(json&&json.long_url)
					destination=json.long_url
			}
		}
		xhr.open("POST","https://api-ssl.bitly.com/v4/expand",false)
		//I just created a Bitly account for Universal Bypass. I hope this will work well.
		xhr.setRequestHeader("Authorization","Bearer e5a30234524046fcffc4ddc741836bd8b9bbdaf9")
		xhr.setRequestHeader("Content-Type","application/json")
		xhr.send(JSON.stringify({"bitlink_id":details.url.split("://")[1]}))
	}
	if(destination)
	{
		console.log(details.url+" -> "+destination)
		return{redirectUrl:destination}
	}
	else console.error("Failed to get destination for "+details.url)
},{urls:["*://goo.gl/*","*://bit.ly/*"]},["blocking"])
