import {TwitterFollowersService} from "./twitter/twitter-followers-service";
import {BotRating, TwitterUser, TwitterUserWithRating} from "./types";


class Main {
  private readonly USERNAME = 'realDonaldTrump';

  constructor(private twitterService: TwitterFollowersService) {
    this.twitterService.getFollowersDataSampleForUser(this.USERNAME).subscribe(
        this.processTwitterUserData,
        this.errorHandler);
  }

  private processTwitterUserData(users: TwitterUser[]) {
    const ratings: TwitterUserWithRating[] = [];
    console.log(`\nScores\n=====================`);

    users.forEach(user => {
      const score = Main.calculateBotScore(user);
      const rating: BotRating = {score: score, isBot: score < 0};

      const twitterUserRating: TwitterUserWithRating = Object.assign(user, rating);
      ratings.push(twitterUserRating);
    });

    const printableTable = ratings.map(twitterUser => {
      return { 'Handle': twitterUser.screen_name, 'Score': twitterUser.score, 'Bot?': twitterUser.isBot };
    });
    console.table(printableTable);

    console.log(`\nSending to BigQuery...`);
    // do bigquery stuff
  }

  private static calculateBotScore(user: TwitterUser): number {
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

  private errorHandler(error: any) {
    console.error('–––––––––––––––––––––––––––––––');
    console.error(error);
    console.error('–––––––––––––––––––––––––––––––');
    process.exit(1);
  }
}

new Main(new TwitterFollowersService());
