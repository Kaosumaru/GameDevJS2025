import { useLoader, useThree } from '@react-three/fiber';
import { memo } from 'react';
import { CubeTextureLoader } from 'three';

const SkyBoxData = {
  '1': '/skybox/1.jpg',
  '2': '/skybox/2.jpg',
  '3': '/skybox/3.jpg',
  '4': '/skybox/4.jpg',
  '5': '/skybox/5.jpg',
  '6': '/skybox/6.jpg',
};

export const SkyBox = memo(() => {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    SkyBoxData['1'],
    SkyBoxData['2'],
    SkyBoxData['3'],
    SkyBoxData['4'],
    SkyBoxData['5'],
    SkyBoxData['6'],
  ]);

  scene.background = texture;
  return null;
});

useLoader.preload(CubeTextureLoader, SkyBoxData['1']);
useLoader.preload(CubeTextureLoader, SkyBoxData['2']);
useLoader.preload(CubeTextureLoader, SkyBoxData['3']);
useLoader.preload(CubeTextureLoader, SkyBoxData['4']);
useLoader.preload(CubeTextureLoader, SkyBoxData['5']);
useLoader.preload(CubeTextureLoader, SkyBoxData['6']);
