import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { forEach } from 'lodash';

@Component({
  selector: 'app-campaign-table',
  templateUrl: './campaign-table.component.html',
  styleUrls: ['./campaign-table.component.scss']
})
export class CampaignTableComponent implements OnInit {

  private CAMPAIGN_TABLE = [
      // tslint:disable-next-line:max-line-length
     {'rolls': [2], 'rollDisplay': '2', 'result': 'The player with the highest total resources decides which mission will be played. If there is a tie, the tied players roll off and the winner decides.', 'rolled': -1},
      // tslint:disable-next-line:max-line-length
     {'rolls': [3, 4], 'rollDisplay': '3-4', 'result': 'Play the <a href="/missions/view/disrupt_supply_lines">Disrupt Supply Lines</a> mission (or <a href="/missions/view/take_prisoners">Take Prisoners</a> matched play mission if you have more than two players).', 'rolled': -1},
     // tslint:disable-next-line:max-line-length
     {'rolls': [5], 'rollDisplay': '5', 'result': 'Play the <a href="/missions/view/ambush">Ambush</a> mission (or <a href="/missions/view/recover_intelligence">Recover Intelligence</a> matched play mission if you have more than two players).', 'rolled': -1},
     // tslint:disable-next-line:max-line-length
     {'rolls': [6], 'rollDisplay': '6', 'result': 'Play the <a href="/missions/view/feint">Feint</a> mission (or <a href="/missions/view/terror_tactics">Terror Tactics</a> matched play mission if you have more than two players).', 'rolled': -1},
     // tslint:disable-next-line:max-line-length
     {'rolls': [7], 'rollDisplay': '7', 'result': 'Choose the <a href="/missions/view/assassinate">Assassinate</a> mission or <a href="/missions/view/sweep_and_clear">Sweep and Clear</a> matched play mission.', 'rolled': -1},
     // tslint:disable-next-line:max-line-length
     {'rolls': [8], 'rollDisplay': '8', 'result': 'Play the <a href="/missions/view/take_prisoners">Take Prisoners</a> matched play mission.', 'rolled': -1},
     // tslint:disable-next-line:max-line-length
     {'rolls': [9], 'rollDisplay': '9', 'result': 'Play the <a href="/missions/view/recover_intelligence">Recover Intelligence</a> matched play mission.', 'rolled': -1},
     // tslint:disable-next-line:max-line-length
     {'rolls': [10, 11], 'rollDisplay': '10-11', 'result': 'Play the <a href="/missions/view/terror_tactics">Terror Tactics</a> matched play mission.', 'rolled': -1},
     // tslint:disable-next-line:max-line-length
     {'rolls': [12], 'rollDisplay': '12', 'result': 'The player with the lowest total resources decides which mission is played. If there is a tie, the tied players roll off and the winner decides.', 'rolled': -1}
    ];

  public rolledMission;

  displayedColumns = ['roll', 'result'];
  private dataSource: MatTableDataSource<any>;

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.CAMPAIGN_TABLE;
  }

  ngOnInit() {
  }

  public resetRoll() {
    // tslint:disable-next-line:forin
    forEach(this.CAMPAIGN_TABLE, r => {
      r.rolled = -1;
    });

    this.rolledMission = false;
  }

  public chooseRandomMission() {
    this.resetRoll();
    const randMission = this.roll(6) + this.roll(6);
    console.log(randMission);

    this.rolledMission = randMission;

    forEach(this.CAMPAIGN_TABLE, r => {
      if (r.rolls.includes(randMission)) {
        r.rolled = true;
      } else {
        r.rolled = false;
      }
    });
  }

  public roll(sides: number): number {
    const randRoll = (Math.floor(Math.random() * sides) + 1);
    console.log(randRoll);
    return randRoll;
  }
}
