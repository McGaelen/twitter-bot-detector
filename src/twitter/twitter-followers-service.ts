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

  getFollowersDataSampleForUser(screenName: string): Observable<any | TwitterUser[]> {
    return defer(async () => {
      const result: TwitterUser[] = [];
      const chunkedIds = this.getChunkedArray(
          100,
          await this.getFollowersIdsForUser(screenName));
      console.log('chunked ids: ', chunkedIds.length);
      for (const chunk of chunkedIds) {
        const vals = await this.getUsersLookup(chunk);
        console.log(`pushing ${vals.length} to users array`);
        result.push(...vals);
      }
      return result;
    });
  }


  private getFollowersIdsForUser(screenName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.twitter.getFollowersIds({screen_name: screenName, stringify_ids: true},
          (err, response, body) => {
            reject(err);
          },
          (response: string) => {
            let data: TwitterFollowersIdsResponse = JSON.parse(response);
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
