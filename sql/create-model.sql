CREATE OR REPLACE MODEL bot_ml.users_model
OPTIONS
  (model_type='logistic_reg', labels=['isBot'])
AS
(
  SELECT * from bot_ml.users_training
)