<?php
$patterns=[];
$ipLoggers=file_get_contents("https://raw.githubusercontent.com/hell-sh/Evil-Domains/master/lists/IP%20Loggers.txt");
foreach(explode("\n", $ipLoggers) as $line)
{
	$line = trim($line);
	if($line && substr($line, 0, 1) != "#")
	{
		if(substr($line, 0, 4) == "www.")
		{
			$line = substr($line, 4);
		}
		else if(substr($line, 0, 2) == "i.")
		{
			$line = substr($line, 2);
		}
		else if(substr($line, 0, 6) == "drive.")
		{
			$line = substr($line, 6);
		}
		else if(substr($line, 0, 5) == "maps.")
		{
			$line = substr($line, 5);
		}
		if(!in_array($line, $patterns))
		{
			array_push($patterns, "*://*.{$line}/*");
		}
	}
}
echo json_encode($patterns, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
