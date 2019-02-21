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

if(!file_exists("bypass.zip"))
{
	die("bypass.zip not found.\n");
}
$zip = new ZipArchive();
$zip->open("bypass.zip") or die("Failed to open bypass.zip\n");
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
	if(file_get_contents("_locales/{$locale}/messages.json") == "{\n\n}")
	{
		recursivelyDelete("_locales/{$locale}");
		continue;
	}
	if(in_array($locale, ["es-ES"]))
	{
		rename("_locales/{$locale}", "_locales/".substr($locale, 0, 2));
	}
}
$zip->close();
unlink("bypass.zip");
mkdir("_locales/en");
rename("messages.json", "_locales/en/messages.json");
