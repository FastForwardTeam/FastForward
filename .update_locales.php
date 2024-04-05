<?php
function recursivelyDelete($file)
{
	if(is_dir($file))
	{
		foreach(scandir($file) as $child)
		{
			if(!in_array($child, [".", ".."]))
			{
				recursivelyDelete($file."/".$child);
			}
		}
		rmdir($file);
	}
	else
	{
		unlink($file);
	}
}

if(!file_exists("FastForward (translations).zip"))
{
	die("FastForward (translations).zip not found.\n");
}
$zip = new ZipArchive();
$zip->open("FastForward (translations).zip") or die("Failed to open FastForward (translations).zip\n");
rename("_locales/en/messages.json", "messages.json");
recursivelyDelete("_locales");
$zip->extractTo("_locales");
foreach(scandir("_locales") as $locale)
{
	if(in_array($locale, [".", ".."]))
	{
		continue;
	}
	unlink("_locales/{$locale}/marketing.json");
	$cont = file_get_contents("_locales/{$locale}/messages.json");
	if(rtrim($cont) == "{}")
	{
		recursivelyDelete("_locales/{$locale}");
		continue;
	}
	$json = json_decode($cont, true);
	foreach($json as $key => $data)
	{
		if(in_array($key, ["bypassCounter", "optionsNavigationDelay", "optionsCrowdAutoOpen", "optionsCrowdAutoClose", "beforeNavigateDestination", "beforeNavigateTimer", "beforeNavigateUnsafeTimer", "beforeNavigateInstant", "crowdBypassedInfo", "crowdBypassedTimer", "crowdCloseTimer"]))
		{
			if(strpos($data["message"], "$1") === false)
			{
				echo "$key in $locale is missing $1\n";
			}
		}
		else
		{
			if(strpos($data["message"], "$1") !== false)
			{
				echo "$key in $locale has a superfluous $1\n";
			}
		}
		if(in_array($key, ["infoLinkvertise","infoFileHoster","infoOutdated","crowdWait","crowdDisabled"]))
		{
			if(strpos($data["message"], "\n") !== false)
			{
				echo "$key in $locale has a new line character\n";
			}
		}
	}
	if(in_array($locale, ["es-ES", "br-FR"]))
	{
		rename("_locales/{$locale}", "_locales/".substr($locale, 0, 2));
	}
}
$zip->close();
unlink("FastForward (translations).zip");
mkdir("_locales/en");
rename("messages.json", "_locales/en/messages.json");
