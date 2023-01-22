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
</div>

# Table of Contents
- [Unstable Builds](#download-unstable-builds)
- [Manual Installation](#manual-installation)
  - [Chrome, Chromium, Opera, Brave, Vivaldi, Kiwi](#chrome-chromium-kiwi-opera-opera-gx-vivaldi-brave-etc)
     - [CRX install](#crx-install)
  - [Firefox](#firefox-and-firefox-based-browsers)
    - [Firefox for Android](#firefox-for-android)
- [Installing from web stores](#installing-from-web-stores)
- [Troubleshooting](#troubleshooting)


****
> **Since FastForward has been removed from Chrome Web Store, you'll need to manually install the extension following the steps below.**
****

## Download unstable builds
<div align="center">
<a href="https://nightly.link/FastForwardTeam/FastForward/workflows/main/main/FastForward_chromium.zip"> <img src="https://img.shields.io/badge/Chrome-Dev%20builds-critical?style=for-the-badge&logo=googlechrome" /> </a>
  <br>
<a href="https://nightly.link/FastForwardTeam/FastForward/workflows/main/main/FastForward_firefox.zip"> <img src="https://img.shields.io/badge/Firefox-Dev%20builds-critical?style=for-the-badge&logo=firefoxbrowser" /> </a>
</div>

## Manual Installation
These are the instructions for installing the extension in "unpacked" mode.

### Chrome, Chromium, Kiwi, Opera, Opera GX, Vivaldi, Brave etc.
Make sure to read carefully to avoid any errors.

0. **REMOVE any previous versions of FastForward.**

1. Download the extension using [this link](https://nightly.link/FastForwardTeam/FastForward/workflows/main/main/FastForward_chromium.zip). You'll end with a .zip file on your downloads, like on the screenshot below:
![1](https://i.imgur.com/Nrdgd7R.png)

2. Now unzip the file, using any software you prefer. In the screenshot below, I used [7-zip](https://7-zip.org) to unzip the file.
![2](https://i.imgur.com/93GYoCm.png)

3. Now you'll have a folder called "FastForward_chromium". Enter it and extract (again) the file.

You can do this either using 7-zip:
![3-1](https://i.imgur.com/sQGRJXq.gif)


Or renaming the file extension, like on the gif below:
![3-2](https://i.imgur.com/JkhCV4q.gif)


4. Open the extensions page on your browser (type `chrome://extensions/` on the address bar) and turn on "Developer Mode", like in the image below.
![4](https://i.imgur.com/R1E7LlO.png)


5. Now click on "Load unpacked", and select the folder where Fast Forward was extracted.
![5](https://i.imgur.com/FFQGC2F.gif)

6. If you got any errors, or a message like "You're using FastForward in development mode", see the [Troubleshooting section](#troubleshooting).

#### CRX Install
You can also use auto-updating builds for Google Chrome (Windows, Linux & macOS), Brave (Windows, Linux & macOS), Kiwi (Android), Ungoogled Chromium and Edge. We do not recommend installing from this method if you aren't an experienced user. If you're having trouble installing this way, please install the extension manually.

<details> <summary> Click here for crx install instructions </summary>  

Please follow [the instructions here](https://github.com/FastForwardTeam/releases#installation-instructions) to install the extension using CRX mode.
</details>

### Firefox and Firefox-based browsers

⚠️ This will only work in the nightly or developer version of Firefox.


0. **REMOVE any previous versions of FastForward.**

1. Download the zip using [this link](https://nightly.link/FastForwardTeam/FastForward/workflows/main/main/FastForward_firefox.zip).
2. Unzip the downloaded file so that you have `FastForward_firefox_X.XXXX.xpi`.
3. Open `about:config`
4. Search for `xpinstall.signatures.required`
5. Toggle `xpinstall.signatures.required` to `false` using the button on the right.
6. Restart Firefox.
7. Open `about:addons`
8. Drag your `FastForward_firefox_X.XXXX.xpi` into Firefox, and click "add" when prompted.

#### Firefox for Android

1. Click [here](https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/) and follow the steps.
2. When you are on step 5, place this number: `17352072` on Collection Owner.
3. Write `FastForward` on Collection Name.
4. Tap "Ok".
5. Open Firefox.
6. Tap on the 3 dots.
7. Tap on Extensions.
8. Find FastForward.
9. Add FastForward.

## Installing from Web-Stores

Currently, FastForward is present on the Firefox and Edge web stores.

### Firefox
<a href="https://addons.mozilla.org/firefox/addon/fastforwardteam/"> <img alt="Mozilla Add-on" src="https://img.shields.io/amo/v/fastforwardteam?label=get%20the%20addon&logo=firefoxbrowser&style=for-the-badge"/> </a>

### Edge
<a href="https://microsoftedge.microsoft.com/addons/detail/fastforward/ldcclmkclhomnpcnccgbgleikchbnecl"> <img src="https://img.shields.io/badge/Edge-Get%20the%20addon-informational?style=for-the-badge&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMi4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPSJNMTkyIDEwNC44YzAtOS4yLTUuOC0xNy4zLTEzLjItMjIuOEMxNjcuMiA3My4zIDE2MCA2MS4zIDE2MCA0OGMwLTI2LjUgMjguNy00OCA2NC00OHM2NCAyMS41IDY0IDQ4YzAgMTMuMy03LjIgMjUuMy0xOC44IDM0Yy03LjQgNS41LTEzLjIgMTMuNi0xMy4yIDIyLjhjMCAxMi44IDEwLjQgMjMuMiAyMy4yIDIzLjJIMzM2YzI2LjUgMCA0OCAyMS41IDQ4IDQ4djU2LjhjMCAxMi44IDEwLjQgMjMuMiAyMy4yIDIzLjJjOS4yIDAgMTcuMy01LjggMjIuOC0xMy4yYzguNy0xMS42IDIwLjctMTguOCAzNC0xOC44YzI2LjUgMCA0OCAyOC43IDQ4IDY0cy0yMS41IDY0LTQ4IDY0Yy0xMy4zIDAtMjUuMy03LjItMzQtMTguOGMtNS41LTcuNC0xMy42LTEzLjItMjIuOC0xMy4yYy0xMi44IDAtMjMuMiAxMC40LTIzLjIgMjMuMlY0NjRjMCAyNi41LTIxLjUgNDgtNDggNDhIMjc5LjJjLTEyLjggMC0yMy4yLTEwLjQtMjMuMi0yMy4yYzAtOS4yIDUuOC0xNy4zIDEzLjItMjIuOGMxMS42LTguNyAxOC44LTIwLjcgMTguOC0zNGMwLTI2LjUtMjguNy00OC02NC00OHMtNjQgMjEuNS02NCA0OGMwIDEzLjMgNy4yIDI1LjMgMTguOCAzNGM3LjQgNS41IDEzLjIgMTMuNiAxMy4yIDIyLjhjMCAxMi44LTEwLjQgMjMuMi0yMy4yIDIzLjJINDhjLTI2LjUgMC00OC0yMS41LTQ4LTQ4VjM0My4yQzAgMzMwLjQgMTAuNCAzMjAgMjMuMiAzMjBjOS4yIDAgMTcuMyA1LjggMjIuOCAxMy4yQzU0LjcgMzQ0LjggNjYuNyAzNTIgODAgMzUyYzI2LjUgMCA0OC0yOC43IDQ4LTY0cy0yMS41LTY0LTQ4LTY0Yy0xMy4zIDAtMjUuMyA3LjItMzQgMTguOEM0MC41IDI1MC4yIDMyLjQgMjU2IDIzLjIgMjU2QzEwLjQgMjU2IDAgMjQ1LjYgMCAyMzIuOFYxNzZjMC0yNi41IDIxLjUtNDggNDgtNDhIMTY4LjhjMTIuOCAwIDIzLjItMTAuNCAyMy4yLTIzLjJ6Ii8+PC9zdmc+" /> </a>
<!-- this base64 icon is from https://fontawesome.com -->

### Chrome
Sadly, we've been removed from the Chrome Web Store. See issue [704](https://github.com/FastForwardTeam/FastForward/issues/704).

## Troubleshooting
<details> <summary> "Manifest version 2 is deprecated, and support will be removed in 2023. See https://developer.chrome.com/blog/mv2-transition/ for more details." </summary>
  <br>

Just click on "clear all", this is just a warning, not an error.  
We are currently working on migrating the extension to MV3 to meet Google's deadlines.  
To read more about this, [click here](https://developer.chrome.com/blog/mv2-transition/).

<img src="https://i.imgur.com/zSYDpY0.png"/>

</details>

****

<details> <summary> "You're using FastForward in development mode, which means that bypass definitions are loaded from your local injection_script.js and rules.json. If you would like to use the auto-updating system, delete those files and then check for updates." </summary>
  <br>

Go to the folder where you extracted Fast Forward, and delete the two files below:

<img src="https://i.imgur.com/LZCTweB.png"/>

Then click "Download bypass definitions" on the settings page.
</details>

****

<details> <summary> Infinite "Downloading bypass definitions...." </summary>
  <br>

We have identified the issue and are working to fix this problem!

</details>

****

<details> <summary> "Manifest file is missing or unreadable" </summary>
  <br>
If you got this message:

<img src="https://media.discordapp.net/attachments/886785290700730379/1039633828362330152/image.png">

It's because you forgot to extract twice the file. Please re-read step 3.

</details>

****

<details> <summary> Linkvertise is not being bypassed </summary>


Copy and paste the contents of [this page](https://raw.githubusercontent.com/FastForwardTeam/FastForward/main/src/linkvertise.js).

Go to the extension settings and paste the contents of the file into the "Custom Bypasses" field, as shown below.

<img src="https://i.imgur.com/OqG0Er8.png">
</details>

****

<details> <summary> CRX_MISSING_PROOF error </summary>
<br> Don't waste your time trying to install the .crx version of the install, just install the unpacked version on this guide.
</details>
