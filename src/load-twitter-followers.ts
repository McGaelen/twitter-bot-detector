import {TwitterFollowersService} from "./twitter/twitter-followers-service";


class Main {
  private readonly USERNAME = 'realDonaldTrump';

  constructor(private twitterService: TwitterFollowersService) {
    this.twitterService.getFollowersDataSampleForUser(this.USERNAME).subscribe(
        vals => {
          vals.forEach(val=> {
            console.log(JSON.stringify(val));
          });
        },
        error => {
          console.error('–––––––––––––––––––––––––––––––');
          console.error(error);
          console.error('–––––––––––––––––––––––––––––––');
          process.exit(1);
        });
  }
}

new Main(new TwitterFollowersService());

// let totalBots = 0;
// let totalAccounts = 0;
//
// next('-1');
//
// function next(cursor) {
//   if (cursor !== '0') {
//     getFollowers(cursor)
//   } else {
//     console.log(`Total Accounts: ${totalAccounts}`);
//   }
// }
//
// function getFollowers(cursor) {
//   // console.log(`cursor: ${cursor}`);
//
//   twitter.getFollowersList({screen_name: 'McGaelen', cursor: cursor},
//       (err, response, body) => {
//         console.log('–––––––––––––––––––––––––––––––');
//         console.log(err);
//         // console.log(response);
//         // console.log(body);
//         console.log('–––––––––––––––––––––––––––––––');
//       },
//       (response) => {
//         let data = JSON.parse(response);
//
//         totalAccounts += parseInt(data.users.length);
//
//         data.users.forEach(user => {
//           totalBots += 1;
//           console.log(user.screen_name);
//         });
//
//         next(data.next_cursor_str);
//       }
//   );
// }
