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
	if(file_get_contents("_locales/{$locale}/messages.json") == "[\n\n]")
	{
		recursivelyDelete("_locales/{$locale}");
		continue;
	}
	$arr = explode("-", $locale);
	if(count($arr) == 2)
	{
		rename("_locales/{$locale}", "_locales/".$arr[0]);
	}
}
$zip->close();
unlink("bypass.zip");
mkdir("_locales/en");
rename("messages.json", "_locales/en/messages.json");
