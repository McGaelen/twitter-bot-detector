import {PredictionService} from "./bigquery/prediction-service";
import {TwitterFollowersService} from "./twitter/twitter-followers-service";
import {BigQuery} from "@google-cloud/bigquery";
import {TwitterUser} from "../types";


class Main {
  private bots = 0;
  private notBots = 0;

  constructor(private screenName: string, private predictionService: PredictionService, private twitterService: TwitterFollowersService) {
    this.main();
  }

  private async main() {
    try {
      const users: TwitterUser[] = await this.twitterService.getFollowersDataSampleForUser(this.screenName);

      for (const user of users) {
        const isBot: boolean = await this.predictionService.predict(user);
        isBot ? this.bots++ : this.notBots++;
        console.log(`Bots: ${this.bots}. Records processed: ${this.bots + this.notBots} / ${users.length}`);
      }

      const finalPercentage = (this.bots / users.length) * 100;
      console.log(`Results for ${this.screenName}:\n\t${this.bots} accounts out of a sample size of ${users.length} were bots (${finalPercentage})`)
    } catch (err) {
      this.errorHandler(err);
    }
  }

  private errorHandler(error: any) {
    console.error('–––––––––––––––––––––––––––––––');
    console.error(error);
    console.error('–––––––––––––––––––––––––––––––');
    process.exit(1);
  }
}

new Main(process.argv[2], new PredictionService(new BigQuery()), new TwitterFollowersService());
