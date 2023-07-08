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

****

# Table of Contents
- [Desktop Browsers (Windows, MacOS, Linux)](#desktop-browsers-windows-macos-linux)
  - [Chromium Based Browsers (Chrome, Kiwi, Opera, Opera GX, Vivaldi, Brave etc.)](#chromium-based-browsers-chrome-kiwi-opera-opera-gx-vivaldi-brave-etc)
  - [Firefox-based browsers (Firefox, Waterfox, Pale Moon, Librewolf etc.)](#firefox-based-browsers-firefox-waterfox-pale-moon-librewolf-etc)
- [Mobile Browsers (Android, iOS)](#mobile-browsers-android-ios)
  - [Firefox Nightly for Android](#firefox-nightly-for-android)
  - [Kiwi Browser for Android](#kiwi-browser-for-android)
- [Installing from web stores](#installing-from-web-stores)
- [Troubleshooting](#troubleshooting)


____
## Desktop Browsers (Windows, MacOS, Linux)
These are the instructions for installing the extension in "unpacked" mode. Make sure to read carefully to avoid any errors.

#### Chromium Based Browsers (Chrome, Kiwi, Opera, Opera GX, Vivaldi, Brave etc.)
_⚠️⚠️⚠️ MICROSOFT EDGE USERS, we recommend installing the extension from the Edge Addons Store [HERE](https://microsoftedge.microsoft.com/addons/detail/fastforward/ldcclmkclhomnpcnccgbgleikchbnecl) ⚠️⚠️⚠️_

0. **REMOVE any previous versions of FastForward.**
1. Download the zip using [this link](https://nightly.link/FastForwardTeam/FastForward/workflows/main/main/FastForward_chromium.zip).
2. Unzip the downloaded file so that you have `FastForward_chromium_0.XXXX.zip`. You may now delete `FastForward_chromium.zip`, as it is no longer needed.
3. Back in your browser, go to `chrome://extensions/`.
4. Use the toggle in the top right corner to enable "Developer mode".
5. Drag the `FastForward_chromium_0.XXXX.zip` file into the extensions page. You should now see the extensions options page, with a message saying "Thank you for installing FastForward!". If this is not the case, and you are prompted to save the file, or it downloaded to your downloads folder, see [Troubleshooting](#troubleshooting)
6.  You may now delete the `FastForward_chromium_0.XXXX.zip` file, as it is no longer needed.

Fastforward should now be installed. If you have any issues, **please view the troubleshooting section below before contacting us**. If the issue persists, please contact us on our [Discord server](https://discord.gg/8Z3Z9Z9) for immediate support, or [open and issue on our github](https://github.com/FastForwardTeam/FastForward/issues/new/choose).

#### Firefox-based browsers (Firefox, Waterfox, Pale Moon, Librewolf etc.)
_⚠️⚠️⚠️ This will only work in the nightly or developer version of Firefox, or other versions that allow unsigned available. ⚠️⚠️⚠️
⚠️⚠️⚠️If you do not have one of these browsers, please see our releases page [HERE](https://github.com/FastForwardTeam/FastForward/releases). ⚠️⚠️⚠️_

0. **REMOVE any previous versions of FastForward.**
1. Download the zip using [this link](https://nightly.link/FastForwardTeam/FastForward/workflows/main/main/FastForward_firefox.zip).
2. Unzip the downloaded file so that you have `FastForward_firefox_0.XXXX.xpi`.
3. Open `about:config`
4. Search for `xpinstall.signatures.required`
5. Toggle `xpinstall.signatures.required` to `false` using the button on the right. It may already be set to false, if this is the case, skip this step.
6. Restart Firefox by closing all browser windows and opening it again.
7. Open `about:addons`
8. Drag your `FastForward_firefox_X.XXXX.xpi` into Firefox, and click "add" when prompted.

Fastforward should now be installed. If you have any issues, **please view the troubleshooting section below before contacting us**. If the issue persists, please contact us on our [Discord server](https://discord.gg/8Z3Z9Z9) for immediate support, or [open and issue on our github](https://github.com/FastForwardTeam/FastForward/issues/new/choose).

____


## Mobile Browsers (Android, iOS)
Fastforward is not available on Apple iOS at this time due to restrictions by apple, and is only available for some Android browsers.


#### Firefox Nightly for Android 
⚠️⚠️⚠️ CURRENTLY UNAVAILABLE, see [Issue #920](https://github.com/FastForwardTeam/FastForward/issues/920) ⚠️⚠️⚠️

1. Click [here](https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/) and follow the steps.
2. When you are on step 5, place this number: `17352072` on Collection Owner.
3. Write `FastForward` on Collection Name.
4. Tap "Ok".
5. Open Firefox.
6. Tap on the 3 dots.
7. Tap on Extensions.
8. Find FastForward.
9. Add FastForward.

#### Kiwi Browser for Android

0. **REMOVE any previous versions of FastForward.**
1. Download the zip using [this link](https://nightly.link/FastForwardTeam/FastForward/workflows/main/main/FastForward_chromium.zip).
2. Use your phones file manager to unzip the downloaded file so that you have `FastForward_chromium_0.XXXX.zip`. You may now delete  `FastForward_chromium.zip`, as it is no longer needed.
3. Back in your browser, go to `chrome://extensions/`.
4. Use the toggle in the top right corner to enable "Developer mode".
5. Click the `+ (from .zip/.crx/.user.js)` button near the top of the page, and select the `FastForward_chromium_0.XXXX.zip` file.
6.  You may now delete the `FastForward_chromium_0.XXXX.zip` file, as it is no longer needed.

Fastforward should now be installed. If you have any issues, **please view the troubleshooting section below before contacting us**. If the issue persists, please contact us on our [Discord server](https://discord.gg/8Z3Z9Z9) for immediate support, or [open and issue on our github](https://github.com/FastForwardTeam/FastForward/issues/new/choose).

___

## Troubleshooting
<details> <summary> "Manifest version 2 is deprecated, and support will be removed in 2023. See https://developer.chrome.com/blog/mv2-transition/ for more details." </summary>
  <br>

Just click on "clear all", this is just a warning, not an error.  
We are currently working on migrating the extension to MV3 to meet Google's deadlines.  
To read more about this, [click here](https://developer.chrome.com/blog/mv2-transition/).

<img src="https://i.imgur.com/zSYDpY0.png"/>

</details>
<br>

<details> <summary> "You're using FastForward in development mode, which means that bypass definitions are loaded from your local injection_script.js and rules.json. If you would like to use the auto-updating system, delete those files and then check for updates." </summary>
  <br>

Go to the folder where you extracted Fast Forward, and delete the two files below:

<img src="https://i.imgur.com/LZCTweB.png"/>

Then click "Download bypass definitions" on the settings page.
</details>

<br>

<details> <summary> Infinite "Downloading bypass definitions...." </summary>
  <br>


This is caused by the current bypass definitions version being the same as the downloaded version. you can solve this issue by closing all browser windows and opening them. If this does not work, or the issue persists, please contact us on our [Discord server](https://discord.gg/8Z3Z9Z9).
This issue will be fixed on the next FastForward version, with the manifest version 3.

</details>

<br>

<details> <summary> "Manifest file is missing or unreadable" </summary>
  <br>
This issue happens whe you attempt to install the `FastForward_chromium.zip` file rather than the `FastForward_chromium_0.XXXX.zip` file. Please follow the installation instructions above, ensuring that you carefully follow all steps. If this does not work, or the issue persists, please contact us on our [Discord server](https://discord.gg/8Z3Z9Z9).

</details>
<br>

<details> <summary> Linkvertise is not being bypassed </summary>
Some versions of Fastforward may not come with the linkvertise bypass by default. If you are having issues with linkvertise, please add the Linkvertise bypass manually by folling the steps below.

1. Copy the contents of [this page](https://raw.githubusercontent.com/FastForwardTeam/FastForward/main/src/linkvertise.js). be sure to select all of the text, from the first "d" of `domainBypass`, all the way to (and including) the last `})`. you may also us `ctrl+a` to select all of the text. copy the text by pressing `ctrl+c`.
2. Open the settings page for FastForward. this can be done by clicking the extensions icon in the top right of your browser. this may be in a extensions sub-menu.
3. paste the text you copied in step 1 into the "Custom bypasses" box. take care to do this all the way at the bottom of the custom bypasses box, and not in the middle of any existing custom bypasses.
4. your changes will be saved automatically. if you have a open linkvertise page, please refresh it to be bypassed. 

If this does not work, or the issue persists, please contact us on our [Discord server](https://discord.gg/8Z3Z9Z9).
</details>
<br>

<details> <summary> CRX_MISSING_PROOF error </summary>
<br> Don't waste your time trying to install the .crx version of the install, just install the .zip version on this guide.
</details>
