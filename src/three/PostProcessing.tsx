import { Color } from 'three';
import { forwardRef } from 'react';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { useControls } from 'leva';
import { useThree } from '@react-three/fiber';

const PostProcessing = forwardRef((_, ref) => {
  PostProcessing.displayName = 'PostProcessing'
  const { viewport } = useThree()

  const { active, ior } = useControls({
    active: {
      value: true
    },
    ior: {
      value: 0.9,
      min: 0.8,
      max: 1.2
    }
  })

  return active ? (
    <mesh position={[0, 0, 1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <MeshTransmissionMaterial
        ref={ref}
        background={new Color('white')}
        transmission={0.7}
        roughness={0}
        thickness={0}
        chromaticAberration={0.06}
        anisotropy={0}
        ior={ior}
        //added to make typescript happy
        distortionScale={0}
        temporalDistortion={0}
      />
    </mesh>
  ) : null
})

export default PostProcessing
