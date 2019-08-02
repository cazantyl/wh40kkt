export class Tactic {
  uuid: string;
  title: string;
  type: string; // Attacker Tactic, Defender Tactic, etc
  description: string;
  cost = 0;
  source: string;

  phaseBeforeFirstRound = false;
  phaseStartOfRound = false;
  phaseInitiative = false;
  phaseMovement = false;
  phasePsychic = false;
  phaseShooting = false;
  phaseFight = false;
  phaseMorale = false;
  phaseEndOfRound = false;
}
