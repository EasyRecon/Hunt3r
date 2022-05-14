# First Setup

## Change your password

The first thing to do is to change your login information by going to your profile [/pages/user](http://0.0.0.0/pages/user)

![](../assets/images/profile_update.png)

## Configure a Cloud Provider

!!! warning "Cloud Provider Support"

    Version 1.0 comes with Scaleway support only at the moment, other cloud providers will be added in the following versions with AWS first

!!! info "SSH Key"

    An SSH key will be required by Hunt3r to deploy and manage your servers, however it is possible to configure a specific SSH key for Hunt3r and by provider

To be able to launch a scan you will first have to configure a Cloud Provider on the page [/admin/cloud/settings](http://0.0.0.0/admin/cloud/settings).

### Scaleway configuration

First of all it is necessary to add an SSH key on https://console.scaleway.com/project/credentials

![](../assets/images/Scaleway_SSH_Configuration.png)

As well as a Keys API for Hunt3r, still on the same page

![](../assets/images/Scaleway_API_Keys_Configuration.png)

### Amass configuration

The last step is to add your Amass configuration on [/admin/tools/settings](http://0.0.0.0/admin/tools/), it is indeed not possible to start a scan without putting a configuration file.
Since this tool is the heart of the recognition, we advise you to have as many API keys as possible.

See [How to Use Amass More Effectively for Bug Bounties](https://hakluke.medium.com/haklukes-guide-to-amass-how-to-use-amass-more-effectively-for-bug-bounties-7c37570b83f7)

The default configuration file can be found [here](https://github.com/OWASP/Amass/blob/master/examples/config.ini).

![](../assets/images/install_amass.png)