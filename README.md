# Twitter Bot Detector



## Test Data Algorithm:

* If they have never tweeted in the account's lifetime (this includes retweets).
    "statuses_count": 0

* If they have never favorited/liked a tweet in the account's lifetime.
    "favourites_count": 0

* If they have 0 followers.
    "followers_count": 0

* If they are following less than 25 accounts.
    "friends_count": 25

* If they have the default profile picture.
    "profile_image_url_https": "https:\/\/abs.twimg.com\/sticky\/default_profile_images\/default_profile_normal.png"

* If they don't have a cover photo.
    "profile_background_image_url_https": null
