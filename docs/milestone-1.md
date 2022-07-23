# [object Object] - *Shelter Helper*

## Sections
1. [Team Overview](#team-overview)
2. [Application Idea](#application-idea)
3. [Functionality](#functionality)

## Team Overview

* Max Sonderegger
    * GitHub username: `turingapproved`


## Application Idea
My mom is a nurse for the homeless and she frequently is collecting socks, shirts, underwear, etc. for various shelters and drives. This is often a various tedious task involving recording pledges and tracking down people and their boxes of clothes. 

I would like to make a website that would help keep track of this process. This website will let you sign up as either a shelter or a donor. If you are a shelter you can create drives that require certain amounts of various items (socks, shirts, underwear, etc.). These goals will be tracked and displayed on the shelter's main page which will share a little about the shelter, their location, mission statement etc. If you are a donor you will be able to browse available drives and donate to the ones of your choice. Donors will also have a home page detailing where they are from, and donation history.

Possible additional features include an additional step where user's pick a time and pledge to donate, but don't actually contribute until the corresponding shelter approves their donation, representing actual receipt of the goods. Or a rating and comment system to allow donors and shelters alike to rate each other based on reliability and to allow donors to discuss the experience with other potential donors or with the shelter owners. Or being able to view your donation history or even share it with others. Or the ability for donors and shelters to be verified, similar to a twitter check mark.


## Functionality

I covered the basics of my app above. The data this app would handle would be:
* Drive information:
    * location - simple string (e.g. Boston, MA)
    * times - unix timestamps
    * goods wanted (quantity/type) - table matching goods to drives
    * comments - table mapping comments to drives
    * rating - float
    * goods pledged - table matching pledges to drives
    * goods delivered - pledges will have a boolean delivered field
* Good information:
    * what kinds of goods can the shelters request - table of goods
* Donor information:
    * comments - table mapping comments to donors
    * rating - float
    * history of donations - table mapping donors to pledges
    * photo - blob
    * verified - boolean
* Shelter information:
    * location - simple string (e.g. Boston, MA)
    * comments - table mapping comments to shelters
    * rating - float
    * photo - blob
    * verified - boolean
* Comment information
    * what is the comment, commenting on - various tables storing comment to object mappings
    * comment structure (comments, sub comments) - comments will have a parent field, which is a FK to the comment table
    * date, author, etc. - unix time stamp, FK to donors or shelters, etc.