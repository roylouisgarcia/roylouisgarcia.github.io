---
layout: post
title: "Installing Samba Server on Ubuntu/PopOS"
categories: administration
topic: administration
---

# Goal:

Ultimately, I aim to be able to map a PopOS folder to my Windows 10 machine. I do not want to keep syncing these two machines and keeping track of duplicate copies. I want to designate a folder on my PopOS machine where I can move, edit and save files to from any computer. This way, any changes I do to files and directories on this Samba folder from my Windows 10 machine will be saved on the PopOS machine. Lastly, I do not need to keep any copy of files on my Windows 10 machine. How do I accomplish this? 

# Solution:																								
It is time to learn about Samba by installing it on my PopOS machine, creating a Samba user and designating a Samba private folder that I can later map from my Windows 10 machine. I followed the instructions from this site: <https://www.linuxbabe.com/ubuntu/install-samba-server-file-share>

# Installation:

I was able to run `sudo apt install samba samba-common-bin` and got these errors:

![samba installation error](/assets/images/01_samba_installation_error.jpg)

Despite the above errors, I was able to I check for the version `smbd --version` and got `Version 4.12.5-Ubuntu`. This is a good sign that Samba  server was installed on my Ubuntu/PopOS machine:

One way to verify is to see if the daemon necessary for Samba works by running: `sudo systemctl status smbd nmbd`. This results:

![systemctl status to check samba](/assets/images/02_samba_systemctl_status.jpg)

I was able to start Samba using: `sudo systemctl start smbd nmbd`

I then proceeded adding a Samba user and Samba group:

![adding the user and samba folder](/assets/images/03_samba_user_add.jpg)

Also, I created the Samba folder and configured Samba:

![Creating the samba folder](/assets/images/04_samba_folder_add.jpg)

Restarting Samba using the command: `sudo systemctl restart smbd nmbd`

# Mapping the samba folder in Windows 10 machine

Using Windows Explorer, we type `\\10.0.0.152\Private` on the address bar and we will be asked to sign in as the Samba user that was created:

![mapping the samba folder in Windows 10](/assets/images/05_samba_windows_map.jpg)

# Conclusion:

Samba is one way that Linux machines interoperate with Windows machines. By following the above steps, I am now capable of working on my PopOS Samba folder from any machine that supports Samba and I am able to minimize my workflow by not needing to  worry about redundancies and keenly keeping track of two versions on two machines. I know that there are other and better ways of doing what I wanted to accomplish, but I will explore and write about them next time.

# References:

1. About Samba: <https://www.samba.org/samba/what_is_samba.html>
2. Installing Samba: <https://www.linuxbabe.com/ubuntu/install-samba-server-file-share>

