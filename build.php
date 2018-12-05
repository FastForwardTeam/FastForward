<?php
if(file_exists("Universal Bypass.zip"))
{
	unlink("Universal Bypass.zip");
}
if(file_exists("Universal Bypass Source.zip"))
{
	unlink("Universal Bypass Source.zip");
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
$build = createZip("Universal Bypass.zip");
$firefox = createZip("Universal Bypass for Firefox.zip");
$source = createZip("Universal Bypass Source.zip");
foreach($index as $fn)
{
	if($fn != "build.php")
	{
		if($fn == "content_script.js")
		{
			$cont = str_replace("//\n", "\n", str_replace("\\", "\\\\", preg_replace('/injectScript\("\("\+\(\(\)=>({.*})\)\+"\)\(\)"\)\/\/injectend/s', 'injectScript(`(()=>$1)()`)', file_get_contents($fn))));
			$build->addFromString($fn, $cont);
			$firefox->addFromString($fn, $cont);
		}
		else
		{
			if($fn == "manifest.json")
			{
				$json = json_decode(file_get_contents($fn), true);
				unset($json["web_accessible_resources"]);
				$build->addFromString($fn, json_encode($json, JSON_UNESCAPED_SLASHES));
			}
			else
			{
				$build->addFile($fn, $fn);
			}
			$firefox->addFile($fn, $fn);
		}
	}
	$source->addFile($fn, $fn);
}
$build->close();
$firefox->close();
$source->close();
