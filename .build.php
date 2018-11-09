<?php
if(file_exists("Universal Bypass.zip"))
{
	unlink("Universal Bypass.zip");
}
if(file_exists("Universal Bypass for Chrome.zip"))
{
	unlink("Universal Bypass for Chrome.zip");
}

echo "Indexing...\n";
$index = [];
function recursivelyIndex($dir)
{
	global $index;
	foreach(scandir($dir) as $f)
	{
		if(substr($f, 0, 1) == ".")
		{
			continue;
		}
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
recursivelyIndex(".");

echo "Generating Generic Build...\n";
$zip = new ZipArchive();
$zip->open("Universal Bypass.zip", ZipArchive::CREATE + ZipArchive::EXCL + ZipArchive::CHECKCONS) or die("Failed to create zipfile.\n");
foreach($index as $fn)
{
	$zip->addFile($fn, $fn);
}
$zip->close();

echo "Generating Chrome Build...\n";
$zip = new ZipArchive();
$zip->open("Universal Bypass for Chrome.zip", ZipArchive::CREATE + ZipArchive::EXCL + ZipArchive::CHECKCONS) or die("Failed to create zipfile.\n");
foreach($index as $fn)
{
	if($fn == "manifest.json")
	{
		$manifest = json_decode(file_get_contents("manifest.json"), true);
		unset($manifest["web_accessible_resources"]);
		$zip->addFromString("manifest.json", json_encode($manifest, JSON_UNESCAPED_SLASHES));
	}
	else
	{
		$zip->addFile($fn, $fn);
	}
}
$zip->close();

