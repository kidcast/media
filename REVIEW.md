# Midterm Review

## .env Documentation
Consider creating a `sample.env` file or documenting what properties you
application expects to find in the `.env` file. It's a pain to look through
an application to find out what all it depends on.

## Mongoose Models
Nice Media model. Good use of Mongoose `enum` for the category type of the
videos. Great job relating the videos to users.

Nice job setting the user model up with proper pre-save hashing methods.

## Custom Middleware
Nice job creating the authorization and bearer-middleware functions.

## Routing
Cool custom routing when searching for media. I like the way you have a long
if/else if/else if chain prioritizing things people would want to look up.

That being said, this is a bit redunant. I bet there's a way you can seperate
the logic of configuring what someone is looking for with the functionality of
actually searching for it.

Compare these two code snippets:

```js
if (req.query.id) {
  Media.findOne({
    _id: req.query.id
  }, (err, media) => {
    if (media.public) {
      res.send(media);
    } else {
      res.status(400);
      res.send('Bad Request. Media Request is Pending Approval');
    }
  });
} else if (req.query.category) {
  Media.find({category: req.query.category}, (err, media) => {
    let publicMedia = media.filter(mediaItem => {
      if (mediaItem.public) {
        return mediaItem;
      };
    });
    res.status(200);
    res.send(publicMedia);
  });
} else if (req.query.userId) {
  Media.find({userId: req.query.userId}, (err, media) => {
    let publicMedia = media.filter(mediaItem => {
      if (mediaItem.public) {
        return mediaItem;
      };
    });
    res.status(200);
    res.send(publicMedia);
  });
} else {
  Media.find((err, media) => {
    let publicMedia = media.filter(mediaItem => {
      if (mediaItem.public) {
        return mediaItem;
      };
    });
    res.status(200);
    res.send(publicMedia);
  }).catch(err => {
    console.error(err);
  });
}
```

Refactor to use if/else if blocks to configure something that you'll search
for later in only one find clause.

This code sample shows combining three of the `else if` statements into one.
There's a default `params` as an empty object, then that object is populated
with different information depending on what data the user provided.

You could further wrap the `_id` query with `.findOne()` into this scheme, but
you'd have to do additional work to deal with the fact that you're searching for
one specifically vs searching for a collection.

```js
if (req.query.id) {
  Media.findOne({
    _id: req.query.id
  }, (err, media) => {
    if (media.public) {
      res.send(media);
    } else {
      res.status(400);
      res.send('Bad Request. Media Request is Pending Approval');
    }
  });
} else {
  // default to an unrestricted search.
  let params = {};
  // if someone specifies a category then use that as a param.
  if (req.query.category) {
    params = {category: req.query.category}
  // if someone specifies a userId then use that as a param.
  } else if (req.query.userId) {
    params = {userId: req.query.userId};
  }

  Media.find(params, (err, media) => {
    let publicMedia = media.filter(mediaItem => {
      if (mediaItem.public) {
        return mediaItem;
      };
    });
    res.status(200);
    res.send(publicMedia);
  }).catch(err => {
    console.error(err);
  });
}
```

## Error Checking
Excellent error checking and messages! Wow. I love seeing messages like,
"Bad Request. Please Only Upload mp4, mov, or m4v files."

## Overall
Excellent work! Clean code. Excellent docs. Great product!