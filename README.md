# KidCast
### Kid friendly, parent approved, media resource tool.

**Version**: 1.1.0 Our first release of the KidCast application

## Team Members
* Amber Kim https://github.com/amgranad :innocent:
* Brandon Buchholz https://github.com/bjbuchholz :neckbeard:
* Eric Cobb https://github.com/sonsofdesert :wolf:
* Ryan Johnson  https://github.com/rjtj2007 :evergreen_tree:

## Overview
A back-end server that displays kid centered, safe, searchable, parent-approved content for kids.

## Get started - User

* Click this [link to KidCast](https://kidcast.herokuapp.com)

* Sign Up by entering a new username, password and email

* Sign In using your new username and password

* Upload media content to site

* Search through other user content

## API End Points
User will need to download [Postman](https://www.getpostman.com/) and install the application onto their computer. 

### POST
#### Create new user

/api/signup
```
    {
	"username": "<unique username>",
    "email": "<email address>",
    "password": "<password>"
}
```
RETURN
```
{
    "_id": "<hashed user id>",
    "username": "<username>",
    "email": "<email address>",
    "password": "<hashed password>",
    "__v": 0
}

--> assigns the user a *basic authorization* id and hashed password
```

/api/signin
```
    set postman to *basic auth*
    input username and password

    --> return *bearer authorization* token
```

Proceede to Sign In

### POST
#### Create new media
/api/media
```
    set postman to *bearer auth*
    input token in authorization field

    **input required keys/values**

    media <file to be uploaded>
    title <file title>
    description <file description>
    userId <unique user id from basic auth>
    category <select Fun, Educational or Instructional>
    type <media type (video, audio)>

    **SEND**
    
    --> uploads file to database
```

### GET All
#### Retreve media

/api/media
RETURNS ALL available media resources
```
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

### GET One
#### Retreve media

/api/media?id=
RETURNS ONW media resource

### PUT
#### Upload new media


### DELETE
#### Remove media





## User Stories
* As a user I want to type in a new username.

* As a user I want to enter a password.

* As a user I want to re-enter my password to verify it.

* As a user I want to submit this information and create an account.

* As a user I want to upload personal videos only to be seen by people within my circle - Not public.

* As a user I want to be able to upload videos for public viewing, after approval. 

* As a user, I want my child to be able to view child friendly content without fear of inappropriate ads or content. 

------

* As a developer, I want to create funtions that create a smooth UI experience.

* As a developer, I want to create apps where the user can upload videos and choose to be private (limited to their own account) or public viewing.

* As a developer, I want to create a Public Viewing application where uploaded videos will be filtered before being posted. 

## Change Log

# media

## Problem to be Solved
There are a lot of resources for kids content like youtube that have video/audio content, but it is not always parent approved. With kidcast the parent has control of the content that your kiddo is viewing and have peace of mind that it is safe and approved by the parents.

## Benefits:
* 

