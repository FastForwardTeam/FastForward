<?php
if(file_exists("Universal Bypass.zip"))
{
	unlink("Universal Bypass.zip");
}
if(file_exists("Universal Bypass for Firefox.zip"))
{
	unlink("Universal Bypass for Firefox.zip");
}

echo "Indexing...\n";
$index = [];
function recursivelyIndex($dir)
{
	global $index;
	foreach(scandir($dir) as $f)
	{
		if(substr($f, 0, 1) != ".")
		{
			$fn = $dir."/".$f;
			if(is_dir($fn))
			{
				recursivelyIndex($fn);
			}
			else
			{
				array_push($index, substr($fn, 2));
			}
		}
	}
}
recursivelyIndex(".");

echo "Building...\n";
function createZip($file)
{
	$zip = new ZipArchive();
	$zip->open($file, ZipArchive::CREATE + ZipArchive::EXCL + ZipArchive::CHECKCONS) or die("Failed to create {$file}.\n");
	return $zip;
}
$raw_build = createZip("Universal Bypass for Firefox.zip");
$chromium_build = createZip("Universal Bypass for Chromium-based browsers.zip");
foreach($index as $fn)
{
	if($fn == "README.md" || $fn == "injection_script.js" || $fn == "rules.json")
	{
		continue;
	}
	if($fn == "manifest.json")
	{
		$json = json_decode(file_get_contents($fn), true);
		unset($json["browser_specific_settings"]);
		$json["incognito"] = "split";
		$chromium_build->addFromString($fn, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
	}
	else
	{
		$chromium_build->addFile($fn, $fn);
	}
	$raw_build->addFile($fn, $fn);
}
$raw_build->close();
$chromium_build->close();
