Install git before using the any of the commands. https://git-scm.com/downloads

---
### Squashing commits
to make this:

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
NOTE: Remember to substitue all `<things>`
```
git clone https://github.com/<your username>/FastForward
```
```
cd FastForward
```
```
git reset --soft HEAD~<number of commits you want to squash>
```
```
git commit -m "<your message>"
```
NOTE: When git asks for your password use a [PAT](https://github.com/settings/tokens).
```
git push --force
```
---
### Fixing a messed up main branch
NOTE: If you have made any changes on your main brainch they **will be lost.**

Open the terminal and run the following commands. 
NOTE: Remember to substitue all `<things>`
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
