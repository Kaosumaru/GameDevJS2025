import { attackSkill } from './attack';
import { mageFireball } from './mage/mageFireball';
import { clericHeal } from './cleric/clericHeal';
import { knightAttack } from './knight/knightAttack';
import { moveSkill } from './move';
import { shieldSkill } from './shield';
import { stunSkill } from './stun';
import { knightTaunt } from './knight/knightTaunt';
import { clericDisarm } from './cleric/clericDisarm';
import { mageBlind } from './mage/mageBlind';
import { clericCritical } from './cleric/clericCritical';
import { knightSpeedLight } from './knight/knightSpeedLight';
import { mageSickle } from './mage/mageSickle';
import { knightDarkWide } from './knight/knightDarkWide';
import { knightLightStun } from './knight/knightLightStun';
import { clericLightAllHeal } from './cleric/clericLightAllHeal';
import { mageDarkFireball } from './mage/mageDarkFireball';
import { mageLightFireball } from './mage/mageLightFireball';
import { knightSpeedDark } from './knight/knightSpeedDark';
import { clericDarkHeal } from './cleric/clericDarkHeal';
import { pass } from './pass';
import { testSpawner } from './spawnSkills/testSpawner';
import { auroraMateuszHeal } from '../entities/mateusz/auroraHeal';
import { auroraMove } from '../entities/mateusz/auroraMove';
import { auroraMateuszImmobilize } from '../entities/mateusz/auroraImmobilize';
import { auroraExplosion } from '../entities/mateusz/auroraExplosion';
import { vacuenMove } from '../entities/mateusz/vacuenMove';
import { vacuenSlash } from '../entities/mateusz/vacuenSlash';
import { vacuenCharge } from '../entities/mateusz/vacuenCharge';
import { vacuenLunge } from '../entities/mateusz/vacuenLunge';
import { lacrimosaFireball } from '../entities/mateusz/lacrimosaFireball';
import { lacrimosaDagger } from '../entities/mateusz/lacrimosaDagger';
import { lacrimosaMove } from '../entities/mateusz/lacrimosaMove';
import { lacrimosaSwap } from '../entities/mateusz/lacrimosaSwap';
import { clericAoeNeutral } from './cleric/clericAoeNeutral';
import { clericAoeDark } from './cleric/clericAoeDark';
import { clericAoeLight } from './cleric/clericAoeLight';

export const skillsList = {
  move: moveSkill,
  attack: attackSkill,
  stun: stunSkill,
  shield: shieldSkill,

  pass,
  testSpawner,

  clericHeal,
  clericLightAllHeal,
  clericDarkHeal,
  clericDisarm,
  clericCritical,

  knightTaunt,
  knightAttack,
  knightLightStun,
  knightSpeedLight,
  knightSpeedDark,

  mageFireball,
  mageDarkFireball,
  mageLightFireball,
  mageBlind,
  mageSickle,

  knightDarkWide,

  auroraMove,
  auroraMateuszHeal,
  auroraMateuszImmobilize,
  auroraExplosion,

  vacuenMove,
  vacuenSlash,
  vacuenCharge,
  vacuenLunge,

  lacrimosaMove,
  lacrimosaDagger,
  lacrimosaFireball,
  lacrimosaSwap,

  clericAoeNeutral,
  clericAoeDark,
  clericAoeLight,
};
