export interface MovingParticleEffect {
  type: 'movingParticleEffect';

  effectType: string;
  fromField: string;
  toField: string;
}

export interface ParticleInPlaceEffect {
  type: 'particleInFieldEffect';

  effectType: string;
  inField: string;
}

export type Effect = MovingParticleEffect | ParticleInPlaceEffect;
