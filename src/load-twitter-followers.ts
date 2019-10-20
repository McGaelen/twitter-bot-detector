import {TwitterFollowersService} from "./twitter/twitter-followers-service";
import {TwitterUser} from "./twitter/models/twitter-responses";


class Main {
  private readonly USERNAME = 'realDonaldTrump';

  constructor(private twitterService: TwitterFollowersService) {
    this.twitterService.getFollowersDataSampleForUser(this.USERNAME).subscribe(
        this.processTwitterUserData,
        this.errorHandler);
  }

  private processTwitterUserData(users: TwitterUser[]) {
    // do bot algorithm
  }

  private errorHandler(error: any) {
    console.error('–––––––––––––––––––––––––––––––');
    console.error(error);
    console.error('–––––––––––––––––––––––––––––––');
    process.exit(1);
  }
}

new Main(new TwitterFollowersService());
