<?php
if(file_exists("Universal Bypass.zip"))
{
	unlink("Universal Bypass.zip");
}
$zip = new ZipArchive();
$zip->open("Universal Bypass.zip", ZipArchive::CREATE + ZipArchive::EXCL + ZipArchive::CHECKCONS) or die("Failed to create Universal Bypass.zip.\n");
function recursivelyIndex($dir)
{
	global $zip;
	foreach(scandir($dir) as $f)
	{
		if(substr($f, 0, 1) != ".")
		{
			$fn = $dir."/".$f;
			if(is_dir($fn))
			{
				recursivelyIndex($fn);
			}
			else if($fn != "README.md")
			{
				$fn = substr($fn, 2);
				$zip->addFile($fn, $fn);
			}
		}
	}
}
recursivelyIndex(".");
$zip->close();
