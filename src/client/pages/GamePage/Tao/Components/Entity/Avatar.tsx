import { useLoader } from '@react-three/fiber';
import { Entity } from '@shared/stores/tao/interface';
import { useEffect, useRef } from 'react';
import { Color, TextureLoader } from 'three';
import { useAnimationMotion } from '../Animation/useAnimationMotion';
import { usePrevious } from '../../Hooks/usePrevious';
import { entities } from '@shared/stores/tao/entities/entities';
import { animate } from 'motion';

export const Avatar = ({ entity }: { entity: Entity }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const avatarRef = useRef<any>(null);
  const [colorMap, colorMapDamage] = useLoader(TextureLoader, [
    `/avatars/${entity.avatar}.png`,
    `/avatars/${entity.avatar}-damage.png`,
  ]);

  const base = 800;
  const imageWidth = colorMap.image.width / base;
  const imageHeight = colorMap.image.height / base;
  const previousHp = usePrevious(entity.hp);

  const playNext = useAnimationMotion();

  useEffect(() => {
    if (!previousHp) return;
    if (previousHp.current === entity.hp.current) return;

    playNext('receive-dmg', async () => {
      const obj = avatarRef.current!;
      if (!obj) return;
      await animate([
        [obj, { flash: 0.5 }, { duration: 0.2 }],
        [obj, { flash: 0 }, { duration: 0.2, delay: 0.2 }],
      ]);
    });
  }, [playNext, previousHp, entity.hp, entity.shield]);

  return (
    <mesh position={[0, imageHeight / 2, 1]} renderOrder={5}>
      <planeGeometry args={[imageWidth, imageHeight]} />
      <colorTexMaterial
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={(r: any) => {
          avatarRef.current = r;
        }}
        uTexture={colorMap}
        uTextureDamage={colorMapDamage}
        flashColor={new Color(0xff0000)}
        transparent
      />
    </mesh>
  );
};

Object.values(entities)
  .map(entity => entity({ x: 0, y: 0 }))
  .forEach(entity => {
    useLoader.preload(TextureLoader, [`/avatars/${entity.avatar}.png`, `/avatars/${entity.avatar}-damage.png`]);
  });
