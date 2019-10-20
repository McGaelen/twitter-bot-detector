import {TwitterFollowersService} from "./twitter/twitter-followers-service";
import {BotRating, TwitterUser, TwitterUserWithRating} from "./types";
import {BigQuery} from "@google-cloud/bigquery";


class Main {
  private readonly USERNAME = 'McGaelen';

  constructor(private twitterService: TwitterFollowersService, private bigQueryClient: BigQuery) {
    this.twitterService.getFollowersDataSampleForUser(this.USERNAME).subscribe(
        users => this.processTwitterUserData(users),
        err => this.errorHandler(err));
  }

  private async processTwitterUserData(users: TwitterUser[]) {
    const ratings: TwitterUserWithRating[] = [];
    console.log(`\nScores\n=====================`);

    users.forEach(user => {
      const score = this.calculateBotScore(user);
      const rating: BotRating = {score: score, isBot: score < 0};

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
      return { 'Handle': twitterUser.screen_name, 'Score': twitterUser.score, 'Bot?': twitterUser.isBot };
    });
    console.table(printableTable);
  }

  private async sendToBigQuery(ratings: TwitterUserWithRating[]) {
    console.log(`\nSending to BigQuery...`);
    try {
      await this.bigQueryClient
          .dataset('bot_user_training_data')
          .table('users')
          .insert(ratings);
      console.log('Done sending to BigQuery.');
    } catch (err) {
      err.errors.forEach(error => {
        console.log(JSON.stringify(error.errors));
      })
      // this.errorHandler(err);
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
