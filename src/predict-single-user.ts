import {PredictionService} from "./bigquery/prediction-service";
import {TwitterUser} from "../types";
import {TwitterFollowersService} from "./twitter/twitter-followers-service";
import {BigQuery} from "@google-cloud/bigquery";

/**
 * 1. Query Twitter for user data for a given handle.
 * 2. Add that user as a row in the 'bot_ml.users' table.
 * 3. Create a query that uses ML.PREDICT to query the model, with the input as the row we just added.
 * 4. Show prediction result.
 */
class Main {
  constructor(private screenName: string, private predictionService: PredictionService, private twitterService: TwitterFollowersService) {
    this.main();
  }

  private async main() {
    try {
      const user: TwitterUser = await this.twitterService.getUserData(this.screenName);
      const isBot = await this.predictionService.predict(user);
      console.log(`Is ${user.screen_name} a bot? ${isBot}`);
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
