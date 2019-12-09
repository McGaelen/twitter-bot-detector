export const DATASET = 'bot_ml';
export const TRAINING_DATA_TABLE = 'users_training';
export const MODEL_TABLE = 'users_model';
export const USERS_TABLE = 'users';

export const schema = [
  {name: 'id',	type: 'NUMERIC', mode:	'NULLABLE'},
  {name: 'id_str',	type: 'STRING', mode:	'NULLABLE'},
  {name: 'name',	type: 'STRING', mode:	'NULLABLE'},
  {name: 'screen_name',	type: 'STRING', mode:	'NULLABLE'},
  {name: 'location',	type: 'STRING', mode:	'NULLABLE'},
  {name: 'description',	type: 'STRING', mode:	'NULLABLE'},
  {name: 'url',	type: 'STRING', mode:	'NULLABLE'},
  {name: 'followers_count',	type: 'NUMERIC', mode:	'NULLABLE'},
  {name: 'friends_count',	type: 'NUMERIC', mode:	'NULLABLE'},
  {name: 'listed_count',	type: 'NUMERIC', mode:	'NULLABLE'},
  {name: 'created_at',	type: 'STRING', mode:	'NULLABLE'},
  {name: 'favourites_count',	type: 'NUMERIC', mode:	'NULLABLE'},
  {name: 'verified',	type: 'BOOLEAN', mode:	'NULLABLE'},
  {name: 'statuses_count',	type: 'NUMERIC', mode:	'NULLABLE'},
  {name: 'default_profile',	type: 'BOOLEAN', mode:	'NULLABLE'},
  {name: 'default_profile_image',	type: 'BOOLEAN', mode:	'NULLABLE'},
  {name: 'profile_banner_url',	type: 'STRING', mode:	'NULLABLE'},
];

export const CREATE_TRAINING_TABLE_OPTIONS = {
  location: 'US',
  schema: [
    ...schema,
    {name: 'isBot',	type: 'BOOLEAN', mode:	'NULLABLE'}
  ]
};
