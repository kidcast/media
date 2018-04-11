
# KidCast

### Kid friendly, parent approved, media resource tool.
**Version**: 1.1.0 Our first release of the KidCast application
***

## Table of Content
* [Team Members](#Team-Members)
* [Contributors](#Contributors)
* [Overview](#Overview)
* [Problem Domain](#Problem-Domain)
* [How to Use Our App](#How-to-Use-Our-App)
* [User Stories](#User-Stories)
***

## Team Members
* Amber Kim https://github.com/amgranad :innocent:
* Brandon Buchholz https://github.com/bjbuchholz :neckbeard:
* Eric Cobb https://github.com/sonsofdesert :wolf:
* Ryan Johnson  https://github.com/rjtj2007 :evergreen_tree:
***

## Contributors


## Overview
A back-end server that contains kid centered, safe, searchable, parent-approved video content for kids.
***

## Problem Domain
There are a lot of resources for kids content like youtube that have video content, but it is not always parent approved. With kidcast the parent has control of the content that your kiddo is viewing and have peace of mind that it is safe and approved by the parents.
***

## How to Use Our App

#### Sample POST Request to create a new user

https://kidcast.herokuapp.com/api/signup
``` json
    {
    "username": "<unique username>",
    "email": "<unique email address>",
    "password": "<password>"
    }

    RETURN
    {
    "_id": "<hashed user id>",
    "username": "<username>",
    "email": "<email address>",
    "password": "<hashed password>",
    "__v": 0
    }
```
--> assigns a *basic authorization* id and hashed password to a new user

**Proceede to Sign In**

https://kidcast.herokuapp.com/api/signin

    sign in using your unique username, email and password

--> return *bearer authorization* token to user

#### Sample POST request to create new media content
https://kidcast.herokuapp.com/api/media

**input required key/value pairs**
```
    media <file to be uploaded>
    title <file title>
    description <file description>
    category <choose fun or education>

    SEND
```
    
--> uploads the new file to the database

#### Sample GET ALL request

https://kidcast.herokuapp.com/api/media

RETURNS ALL available public media resources

```json
Single sample return

    {
    "public": <true or false>,
    "_id": "<hashed content id>",
    "title": "<media title>",
    "description": "<media description>",
    "mediaUrl": "<media url>",
    "userId": "<hashed user id>",
    "category": "<media category>",
    "type": "<video>",
    "__v": 0
    },
```

#### Sample GET ONE request

https://kidcast.herokuapp.com/api/media?id=<_id>

RETURNS ONE media resource

```json
Single sample return

    {
    "public": <true or false>,
    "_id": "<hashed content id>",
    "title": "<media title>",
    "description": "<media description>",
    "mediaUrl": "<media url>",
    "userId": "<hashed user id>",
    "category": "<media category>",
    "type": "<video>",
    "__v": 0
    },
```

#### Sample PUT request to update existing media

https://kidcast.herokuapp.com/api/media?id=<_id>


#### Sample DELETE request to remove existing media

https://kidcast.herokuapp.com/api/media?id=<_id>

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


