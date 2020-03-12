<?php
$patterns=[];
//https://github.com/timmyrs/Evil-Domains/blob/master/lists/IP%20Loggers.txt
$ipLoggers=<<<EOS
viral.over-blog.com
gyazo.in
ps3cfw.com
urlz.fr
webpanel.space
steamcommumity.com
i.imgur.com.de
www.fuglekos.com

# Grabify

grabify.link
bmwforum.co
leancoding.co
quickmessage.io
spottyfly.com
spötify.com
stopify.co
yoütu.be
yoütübe.co
yoütübe.com
xda-developers.io
starbucksiswrong.com
starbucksisbadforyou.com
bucks.as
discörd.com
minecräft.com
cyberh1.xyz
discördapp.com
freegiftcards.co
disçordapp.com
rëddït.com

# Cyberhub (formerly SkypeGrab)

ġooģle.com
drive.ġooģle.com
maps.ġooģle.com
disċordapp.com
ìṃgur.com
transferfiles.cloud
tvshare.co
publicwiki.me
hbotv.co
gameskeys.shop
videoblog.tech
twitch-stats.stream
anonfiles.download
bbcbloggers.co.uk

# Yip

yip.su
iplogger.com
iplogger.org
iplogger.ru
2no.co
02ip.ru
iplis.ru
iplo.ru
ezstat.ru

# What's their IP

www.whatstheirip.com
www.hondachat.com
www.bvog.com
www.youramonkey.com

# Pronosparadise

pronosparadise.com
freebooter.pro

# Blasze

blasze.com
blasze.tk

# IPGrab

ipgrab.org
i.gyazos.com
EOS;
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
