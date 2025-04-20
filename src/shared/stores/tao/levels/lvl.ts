import { createLevel0 } from './level0';
import { createLevel1 } from './level1';
import { createLevel2 } from './level2';

export function createLevel(index: number) {
  switch (index) {
    case 0:
      return createLevel0();
    case 1:
      return createLevel1();
    case 2:
      return createLevel2();
  }
  return createLevel0();
}
