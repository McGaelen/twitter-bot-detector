SELECT roc_auc, accuracy, precision, recall
FROM
  ML.EVALUATE(MODEL bot_ml.users_model)