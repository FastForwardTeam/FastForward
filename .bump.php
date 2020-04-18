<?php
if(empty($argv[1]))
{
	die("Syntax: php .bump.php <version>\n");
}
if(count(explode(".", $argv[1])) != 3)
{
	die("Version needs to be in format x.x.x\n");
}
$json = json_decode(file_get_contents("manifest.json"), true);
if(version_compare($json["version"], $argv[1]) > 0)
{
	die("Version has to increase\n");
}
$json["version"] = $argv[1];
file_put_contents("manifest.json", str_replace("    ", "\t", json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)));
file_put_contents(".next_build_id.txt", "0");
passthru("git add manifest.json");
passthru("git commit -m \"Bump version to {$argv[1]}\"");
