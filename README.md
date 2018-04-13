
# KidCast

### Kid friendly, parent approved, media resource tool.
**Version**: 1.1.0 Our first release of the KidCast application
***


## Table of Contents
* [Team Members](#TeamMembers)
* [Contributors](#Contributorsattribution)
* [Overview](#Overview)
* [Problem Domain](#ProblemDomain)
* [How to Use Our Api](#HowtoUseOurApi)
* [User Stories](#UserStories)
***


## Team Members
* Amber Kim https://github.com/amgranad | https://www.linkedin.com/in/ambergkim/ :innocent:
* Brandon Buchholz https://github.com/bjbuchholz | https://www.linkedin.com/in/brandonbuchholz/ :neckbeard:
* Eric Cobb https://github.com/sonsofdesert | https://www.linkedin.com/in/eric-cobb/ :wolf:
* Ryan Johnson  https://github.com/rjtj2007 | https://www.linkedin.com/in/ryan-johnson-95ab8a25/ :evergreen_tree:
***


## Contributors/Attribution
* JB Tellez for Mongone.js :surfer:
* Steve Geluso and Jeff for the server toggle. :bicyclist:
* emailregex.com for the email regex validation.


## Overview
A back-end server and API that contains kid centered, safe, searchable, parent-approved video content for kids.
***


## Problem Domain
There are a lot of resources for kids content like youtube that have video content, but it is not always parent approved. With kidcast the videos your child watches have to pass our KidCast Values. As a parent, you should have peace of mind that what your children are viewing are safe and approved by parents.
***


## KitCast Values
* We value kindness and respect at the utmost.
* We uplift others through education and encouragement.
***


## How to Use Our API

[Click to View our Diagram Overview](https://github.com/kidcast/media/blob/master/kidcast-backend-diagram.pdf)

#### Sample POST Request to create a new user

`https://kidcast.herokuapp.com/api/signup`

Sample Request JSON
``` json
{
    "username": "<unique username>",
    "email": "<unique email address>",
    "password": "<password>"
}
```
Sample JSON that is returned.
```
{
    "message": "Account has been successfully created",
    "isAdmin": false,
    "username": "newUsername",
    "email": "email@email.com"
}
```
--> Assigns a *basic authorization* id and hashed password to a new user.

--> Usernames and passwords have to be unique.


#### Sample GET Request to sign in

`https://kidcast.herokuapp.com/api/signin`

```
   Authorization Basic dXNlcjpwYXNzd29yZA==
```
--> returns *bearer authorization* token


#### Sample POST request to upload new media content

`https://kidcast.herokuapp.com/api/media`

```
    Authorization Bearer aslkdjflskdjflksjlTOKENSAMPLE
```

**input required key/value pairs**
Your movie file should be entered as form data and your POST details as fields.
```
    media <file to be uploaded>
    title <file title>
    description <file description>
    category <choose fun or education>
```
--> Uploads the new file to the database.

--> Title and category is required.

--> Category must either be 'fun' or 'education'

--> Your post will be automatically set to public and will not be publicly available until a KidCast administrator approves your content.


#### Sample GET ALL request
Only resources set to public will be available. If your resource does not show up, it's still in the queue to be approved.

`https://kidcast.herokuapp.com/api/media`

RETURNS ALL available public media resources

Single sample return
```json
[
    {
        "public": true,
       "_id": "<hashed content id>",
        "title": "<media title>",
        "description": "<media description>",
        "mediaUrl": "<media url>",
        "userId": "<hashed user id>",
        "category": "<media category>",
       "type": "<video>",
        "__v": 0
    }
],
```


#### Sample GET ONE request

`https://kidcast.herokuapp.com/api/media?id=<_id>`

Where '<_id>' is the resource id of the video you want to find.

RETURNS ONE media resource

Single sample return
```json
{
    "public": true,
    "_id": "<hashed content id>",
    "title": "<media title>",
    "description": "<media description>",
    "mediaUrl": "<media url>",
    "userId": "<hashed user id>",
    "category": "<media category>",
    "type": "<video>",
    "__v": 0
}
```

#### Available filters for GET requests

Available Categories: 'fun', and 'education'
`https://kidcast.herokuapp.com/api/media?category=<category>`

Filtering By creator/user
`https://kidcast.herokuapp.com/api/media?userId=<userId>`


#### Sample PUT request to update existing media

`https://kidcast.herokuapp.com/api/media?id=<_id>`

```
    Authorization Bearer aslkdjflskdjflksjlTOKEN
```
Sample request body JSON
``` json
{
    "title" : "This is my title",
    "description" : "I love KidCast!",
    "category" : "fun"
}
```
Sample return body JSON
```
{
    "type": "video",
    "public": true,
    "_id": "5ace6b6fc31b8e13551539e0",
    "title": "yay!",
    "description": "hello",
    "mediaUrl": "https://kidcast1.s3.us-west-2.amazonaws.com/child-running-in-playground.mp4",
    "userId": "5ace6b68c31b8e13551539df",
    "category": "education",
    "__v": 0
}
```
--> The only categories available are 'fun' and 'education'

--> Users may only UPDATE their own resources.

--> Admin accounts are able to UPDATE all resources.


#### Sample DELETE request to remove existing media

`https://kidcast.herokuapp.com/api/media?id=<_id>`

Successful DELETE requests will return a status code of 204 No Content.

--> Users may only DELETE their own resources.

--> Admin accounts are able to DELETE all resources.
***

## User Stories

### User

 *  As a user, I want to create an account for kidcast so that I can start using the system immediately.
 *  As a user, I want to be able to login in and view videos that I feel are kid friendly and parent approved(admin will approve content before everyone can view).
 *  As a user, I want to upload kid friendly videos to be seen by other users(once approved by admin).
 *  As a user, I want to delete my own videos
 *  As a user, I want my child to be able to view child friendly content without fear of inappropriate ads or content. 

### Admin

 * As an admin, I want to be able to approve content and post for public viewing by all users.
 * As an admin, I want to be able to modify or delete users as needed.
 * As an admin, I want to be able to approve content and post for public viewing by all users

### Developer
 * As a developer, I want to create an app that a allows users to sign-up securely and share  uploaded videos with other users that are kid friendly and parent approved that.
 * As a developer, I want to create an interface that uses AWS s3 for keeping track of media uploads.
 * As a developer, I want to create an app where the user can upload videos and choose to be private (limited to their own account) or public viewing.
 * As a developer, I want to create a Public Viewing application where uploaded videos will be filtered before being posted. 


