SELECT
    predicted_isBot
FROM
    ML.PREDICT(
            MODEL bot_ml.users_model,
            (SELECT * FROM bot_ml.users WHERE screen_name = '${screeName}')
        )