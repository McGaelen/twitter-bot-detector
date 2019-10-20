import {
  TwitterFollowersIdsResponse, TwitterUser,
  TwitterUsersLookupResponse
} from "./models/twitter-responses";
import {defer, Observable} from "rxjs";
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

  getFollowersDataSampleForUser(screenName: string): Observable<TwitterUser[]> {
    return defer(async () => {
      const result: TwitterUser[] = [];
      const chunkedIds = this.getChunkedArray(
          100,
          await this.getFollowersIdsForUser(screenName));
      for (const chunk of chunkedIds) {
        result.push(...await this.getUsersLookup(chunk));
        console.log(`User data retrieved for ${result.length} users`);
      }
      return result;
    });
  }

  private getFollowersIdsForUser(screenName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      console.log('Getting user IDs...');
      this.twitter.getFollowersIds({screen_name: screenName, stringify_ids: true},
          (err, response, body) => {
            reject(err);
          },
          (response: string) => {
            let data: TwitterFollowersIdsResponse = JSON.parse(response);
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
          (response: string) => {
            let data: TwitterUsersLookupResponse = JSON.parse(response);
            resolve(data);
          });
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
}
