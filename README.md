
# KidCast

### Kid friendly, parent approved, media resource tool.
**Version**: 1.1.0 Our first release of the KidCast application
***

## Table of Content
* [Team Members](#Team-Members)
* [Overview](#Overview)
* [How to Use Our App](#How-to-Use-Our-App)
***

## Team Members
* Amber Kim https://github.com/amgranad :innocent:
* Brandon Buchholz https://github.com/bjbuchholz :neckbeard:
* Eric Cobb https://github.com/sonsofdesert :wolf:
* Ryan Johnson  https://github.com/rjtj2007 :evergreen_tree:
***

## Overview
A back-end server that contains kid centered, safe, searchable, parent-approved video content for kids.
***

## How to Use Our App

#### Sample POST Request to create a new user

https://kidcast.herokuapp.com/api/signup
``` json
    {
    "username": "<unique username>",
    "email": "<email address>",
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
--> assigns the user a *basic authorization* id and hashed password to a new user

**Proceede to Sign In**

https://kidcast.herokuapp.com/api/signin

    sign in using your unique username, email and password

--> return *bearer authorization* token

#### Sample POST request to create new media content
https://kidcast.herokuapp.com/api/media

set postman to _bearer auth_
input token in authorization field

**input required keys/values**
```

    media <file to be uploaded>
    title <file title>
    description <file description>
    userId <unique user id from basic auth>
    category <select Fun, Educational or Instructional>
    type <media type (video, audio)>

```
**SEND**
    
--> uploads file to database


### GET All
#### Retreve media

https://kidcast.herokuapp.com/api/media

RETURNS ALL available media resources
```json
    {
    "public": <true or false>,
    "_id": "<hashed user id>",
    "title": "<media title>",
    "description": "<media description>",
    "mediaUrl": "<media url>",
    "userId": "<hashed user id>",
    "category": "<media category>",
    "type": "<media file type>",
    "__v": 0
    },
```

### GET ONE
#### Retreve media

https://kidcast.herokuapp.com/api/media?id=<_id>

RETURNS ONE media resource

### PUT
#### Upload new media


### DELETE
#### Remove media



## Problem to be Solved
There are a lot of resources for kids content like youtube that have video content, but it is not always parent approved. With kidcast the parent has control of the content that your kiddo is viewing and have peace of mind that it is safe and approved by the parents.


# User Stories
12 stories total.
3 roles defined.

## By Role

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


