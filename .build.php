<?php
if(file_exists("Universal Bypass Source.zip"))
{
	unlink("Universal Bypass Source.zip");
}
if(file_exists("Universal Bypass for Chrome.zip"))
{
	unlink("Universal Bypass for Chrome.zip");
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
$source = createZip("Universal Bypass Source.zip");
$chrome = createZip("Universal Bypass for Chrome.zip");
$firefox = createZip("Universal Bypass for Firefox.zip");
foreach($index as $fn)
{
	if($fn == "content_script.js")
	{
		$cont = str_replace("\\", "\\\\", preg_replace('/injectScript\("\("\+\(\(\)=>({.*})\)\+"\)\(\)"\)\/\/injectend/s', 'injectScript(`(()=>$1)()`)', file_get_contents($fn)));
		$chrome->addFromString($fn, $cont);
		$firefox->addFromString($fn, $cont);
		unset($cont);
	}
	else
	{
		if($fn == "manifest.json")
		{
			$json = json_decode(file_get_contents($fn), true);
			unset($json["web_accessible_resources"]);
			$chrome->addFromString($fn, json_encode($json, JSON_UNESCAPED_SLASHES));
			unset($json);
		}
		else
		{
			$chrome->addFile($fn, $fn);
		}
		$firefox->addFile($fn, $fn);
	}
	$source->addFile($fn, $fn);
}
$source->close();
$chrome->close();
$firefox->close();
