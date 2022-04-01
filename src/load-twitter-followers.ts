import {TwitterFollowersService} from "./twitter/twitter-followers-service";
import {BotRating, TwitterUser, TwitterUserWithRating} from "../types";
import {BigQuery} from "@google-cloud/bigquery";
import {CREATE_TRAINING_TABLE_OPTIONS, DATASET, TRAINING_DATA_TABLE} from "./bigquery/bigquery-constants";


class Main {
  // @Twitter - Twitter's Twitter account
  private readonly USERNAME = 'Twitter';

  constructor(private twitterService: TwitterFollowersService, private bigQueryClient: BigQuery) {
    this.main();
  }

  private async main() {
    try {
      const users = await this.twitterService.getFollowersDataSampleForUser(this.USERNAME);
      this.processTwitterUserData(users);
    } catch (err) {
      this.errorHandler(err);
    }
  }

  private processTwitterUserData(users: TwitterUser[]) {
    const ratings: TwitterUserWithRating[] = [];
    console.log(`\nScores\n=====================`);

    users.forEach(user => {
      const score = this.calculateBotScore(user);
      const rating: BotRating = {isBot: score < 0};

      const twitterUserRating: TwitterUserWithRating = Object.assign(user, rating);
      ratings.push(twitterUserRating);
    });

    this.printResultsToConsole(ratings);
    this.sendToBigQuery(ratings);
  }

  private calculateBotScore(user: TwitterUser): number {
    let score = 0;

    user.statuses_count === 0 ? score-- : score++;
    user.favourites_count === 0 ? score -- : score++;
    user.followers_count === 0 ? score-- : score++;
    user.friends_count < 25 ? score-- : score++;
    user.default_profile_image ? score-- : score++;
    user.default_profile ? score-- : score++;
    !user.profile_banner_url ? score-- : score++;

    return score;
  }

  private printResultsToConsole(ratings: TwitterUserWithRating[]) {
    const printableTable = ratings.map(twitterUser => {
      return { 'Handle': twitterUser.screen_name, 'Bot?': twitterUser.isBot };
    });
    console.table(printableTable);
  }

  private async sendToBigQuery(ratings: TwitterUserWithRating[]) {
    console.log(`\nSending to BigQuery...`);
    try {
      const tableExists = await this.bigQueryClient.dataset(DATASET).table(TRAINING_DATA_TABLE).exists();
      if (tableExists) {
        await this.bigQueryClient
            .dataset(DATASET)
            .table(TRAINING_DATA_TABLE)
            .delete();
      }
      const [table] = await this.bigQueryClient
          .dataset(DATASET)
          .createTable(TRAINING_DATA_TABLE, CREATE_TRAINING_TABLE_OPTIONS);
      await table.insert(ratings);
      console.log('Done sending to BigQuery.');
    } catch (err) {
      err.errors.forEach(error => {
        console.log(JSON.stringify(error.errors));
      });
      process.exit(1);
    }
  }

  private errorHandler(error: any) {
    console.error('–––––––––––––––––––––––––––––––');
    console.error(error);
    console.error('–––––––––––––––––––––––––––––––');
    process.exit(1);
  }
}

new Main(new TwitterFollowersService(), new BigQuery());
