import {BigQuery} from "@google-cloud/bigquery";
import {DATASET, USERS_TABLE} from "./bigquery-constants";
import {TwitterUser} from "../../types";

export class PredictionService {
  constructor(private bigQueryClient: BigQuery) {}

  async predict(user: TwitterUser): Promise<boolean> {
    await this.bigQueryClient
        .dataset(DATASET)
        .table(USERS_TABLE)
        .insert(user);

    const options = {
      query: this.createPredictQuery(user.screen_name),
      location: 'US',
    };

    const [rows] = await this.bigQueryClient.query(options);
    return rows[0].predicted_isBot;
  }

  private createPredictQuery(screeName: string): string {
    return `
        SELECT 
            predicted_isBot
        FROM 
            ML.PREDICT(
                MODEL bot_ml.users_model, 
                (SELECT * FROM bot_ml.users WHERE screen_name = '${screeName}')
            )
    `;
  }
}
