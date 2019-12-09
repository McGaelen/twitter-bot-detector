import {
  TwitterFollowersIdsResponse, TwitterUser,
  TwitterUsersLookupResponse
} from "../../types";
import {Twitter} from "twitter-node-client"
import {config} from 'dotenv';

export class TwitterFollowersService {

  private twitter;

  constructor() {
    config({ path: '.twitter-bot-detector.env' });
    this.twitter = new Twitter({
      consumerKey: process.env.consumerKey,
      consumerSecret: process.env.consumerSecret,
      accessToken: process.env.accessToken,
      accessTokenSecret: process.env.accessTokenSecret,
      callBackUrl: null
    });
  }

  async getFollowersDataSampleForUser(screenName: string): Promise<TwitterUser[]> {
    const result: TwitterUser[] = [];
    const chunkedIds = this.getChunkedArray(
        100,
        await this.getFollowersIdsForUser(screenName));
    for (const chunk of chunkedIds) {
      const users: TwitterUsersLookupResponse = await this.getUsersLookup(chunk);
      result.push(...users.map(this.filterUnusedProperties));
      console.log(`User data retrieved for ${result.length} users`);
    }
    return result;
  }

  getUserData(screenName: string): Promise<TwitterUser> {
    return new Promise((resolve, reject) => {
      this.twitter.getUser({screen_name: screenName},
          (err, response, body) => reject(err),
          (response: string) => {
            const data: TwitterUser = this.filterUnusedProperties(JSON.parse(response));
            console.log(`Got data for user ${data.screen_name}.`);
            resolve(data);
          })
    });
  }

  private getFollowersIdsForUser(screenName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      console.log('Getting user IDs...');
      this.twitter.getFollowersIds({screen_name: screenName, stringify_ids: true},
          (err, response, body) => reject(err),
          (response: string) => {
            const data: TwitterFollowersIdsResponse = JSON.parse(response);
            console.log(`Got ${data.ids.length} ids.`);
            resolve(data.ids);
          });
    })
  }

  private getUsersLookup(ids: string[]): Promise<TwitterUsersLookupResponse> {
    return new Promise((resolve, reject) => {
      let idsStr = '';
      ids.forEach(id => idsStr += `${id},`);

      this.twitter.getCustomApiCall('/users/lookup.json', {user_id: idsStr},
          (err, response, body) => reject(err),
          (response: string) => resolve(JSON.parse(response)));
    });
  }

  private getChunkedArray<T>(chunkSize: number, array: Array<T>): T[][] {
    const chunkedArray = Array(Math.ceil(array.length / chunkSize)).fill(null);
    return chunkedArray.map((_, index) => {
      const startIndex = index * chunkSize;
      const endIndex = startIndex + chunkSize;
      return array.slice(startIndex, endIndex);
    });
  }

  private filterUnusedProperties(responseUser: any): TwitterUser {
    return {
      id: responseUser.id,
      id_str: responseUser.id_str,
      name: responseUser.name,
      screen_name: responseUser.screen_name,
      location: responseUser.location,
      description: responseUser.description,
      url: responseUser.url,
      followers_count: responseUser.followers_count,
      friends_count: responseUser.friends_count,
      listed_count: responseUser.listed_count,
      created_at: responseUser.created_at, // Wed May 23 06:01:13 +0000 2007
      favourites_count: responseUser.favourites_count,
      verified: responseUser.verified,
      statuses_count: responseUser.statuses_count,
      default_profile: responseUser.default_profile,
      default_profile_image: responseUser.default_profile_image,
      profile_banner_url: responseUser.profile_banner_url
    };
  }
}
