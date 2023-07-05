<div align="center">
<img src="https://avatars.githubusercontent.com/u/88992224?s=200&v=4" width="128" />
<h1> FastForward </h1>
<p> Don't waste your time with compliance. FastForward automatically skips annoying link shorteners. </p>



[<img src="https://img.shields.io/github/actions/workflow/status/fastforwardteam/fastforward/main.yml?branch=main&label=Builds&style=for-the-badge" />](https://github.com/FastForwardTeam/FastForward/blob/main/.github/workflows/main.yml)
<a href="https://discord.gg/RSAf7b5njt" target="_blank"> <img alt="Discord" src="https://img.shields.io/discord/876622516607656006?label=Our%20Discord&logo=discord&style=for-the-badge"> </a>
<br> <br>
<a href="https://github.com/FastForwardTeam/FastForward#why-is-fastforward-no-longer-on-the-chrome-web-store"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get FastForward on Chromium based browsers" width="126px"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/fastforward/ldcclmkclhomnpcnccgbgleikchbnecl"><img src="https://user-images.githubusercontent.com/585534/107280673-a5ece780-6a26-11eb-9cc7-9fa9f9f81180.png" alt="Get FastForward on Microsoft Edge" width="126px"></a>
<a href="https://addons.mozilla.org/firefox/addon/fastforwardteam/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get FastForward for Firefox" width="126px"></a> 

---

**Make sure you [install git](https://git-scm.com/downloads) before using any of the commands below.**

---
</div>

# Common Git Commands
## Squashing commits
To make this:

>• Update readme.md
>
>• Update readme.md
>
>• Update readme.md
>
>• Update readme.md

Into this: 

> • Fix link in README


Open the terminal and run the following commands. 
NOTE: Remember to substitute all `<things>`
```
git clone https://github.com/<YOUR USERNAME>/FastForward
```
```
cd FastForward
```

<pre>
If you didn't make the changes on main- 
  git checkout &lt;YOUR BRANCH NAME&gt;
</pre>

```
git reset --soft HEAD~<number of commits you want to squash>
```
```
git commit -m "<YOUR MESSAGE>"
```
NOTE: When git asks for your password use a [PAT](https://github.com/settings/tokens).
```
git push --force
```
---
### Fixing a messed up main branch
NOTE: If you have made any changes on your main branch they **will be lost.**

Open the terminal and run the following commands. 
NOTE: Remember to substitute all `<things>`
```
git clone https://github.com/<your username>/FastForward
```
```
cd FastForward
git remote add upstream https://github.com/FastForwardteam/FastForward
git fetch upstream
git checkout main
git reset --hard upstream/main 
 
```

NOTE: When git asks for your password use a [PAT](https://github.com/settings/tokens).
```
git push origin main --force 
```
