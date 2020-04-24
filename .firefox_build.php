<?php
function recursivelyDelete($path)
{
	if(substr($path, -1) == "/")
	{
		$path = substr($path, 0, -1);
	}
	if(!file_exists($path))
	{
		return;
	}
	if(is_dir($path))
	{
		foreach(scandir($path) as $file)
		{
			if(!in_array($file, [
				".",
				".."
			]))
			{
				recursivelyDelete($path."/".$file);
			}
		}
		rmdir($path);
	}
	else
	{
		unlink($path);
	}
}
if(file_exists("Universal Bypass for Netscape Navigator.zip"))
{
	unlink("Universal Bypass for Netscape Navigator.zip");
}
if(is_dir(".firefox"))
{
	recursivelyDelete(".firefox");
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
				mkdir(".firefox/".$fn);
				recursivelyIndex($fn);
			}
			else
			{
				array_push($index, substr($fn, 2));
			}
		}
	}
}
mkdir(".firefox");
recursivelyIndex(".");

echo "Building...\n";
function createZip($file)
{
	$zip = new ZipArchive();
	$zip->open($file, ZipArchive::CREATE + ZipArchive::EXCL + ZipArchive::CHECKCONS) or die("Failed to create {$file}.\n");
	return $zip;
}
$build = createZip("Universal Bypass for Netscape Navigator.zip");
$build_id = intval(file_get_contents(".next_build_id.txt"));
$json = json_decode(file_get_contents("manifest.json"), true);
$extension_version = $json["version"];
$definitions_version = substr(shell_exec("git rev-parse HEAD"), 0, 7);
foreach($index as $fn)
{
	if($fn == "README.md" || $fn == "Universal Bypass for Chromium-based browsers.zip")
	{
		continue;
	}
	if($fn == "manifest.json")
	{
		$json = json_decode(file_get_contents($fn), true);
		unset($json["browser_specific_settings"]);
		$json["version"] .= ".".$build_id;
		$content = str_replace("    ", "\t", json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
		$build->addFromString($fn, $content);
		file_put_contents(".firefox/".$fn, $content);
	}
	else if($fn == "background.js")
	{
		$content = str_replace([
			"extension_version=brws.runtime.getManifest().version,",
			"definitions_version=\"\",",
			"if(definitions_version===\"\")",
		],
		[
			"extension_version=\"{$extension_version}\",",
			"definitions_version=\"{$definitions_version}\",",
			"if(false)"
		], file_get_contents($fn));
		$build->addFromString($fn, $content);
		file_put_contents(".firefox/".$fn, $content);
	}
	else
	{
		$build->addFile($fn, $fn);
		copy($fn, ".firefox/".$fn);
	}
}
$build->close();
file_put_contents(".next_build_id.txt", $build_id + 1);
if(is_file(".sign_firefox_build.bat"))
{
	passthru(".sign_firefox_build.bat");
}
recursivelyDelete(".firefox");
