import fragment from '@/three/shaders/fragment.glsl';
import gsap from 'gsap';
import vertex from '@/three/shaders/vertex.glsl';
import { useEffect, useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const Plane = ({ texture, width, height, active, ...props }: PlaneType) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { viewport } = useThree()
  const tex = useTexture(texture)

  useEffect(() => {
    if (meshRef.current.material) {
      const meshMaterial = (meshRef.current.material) as THREE.ShaderMaterial
      //  Setting the 'uZoomScale' uniform in the 'Plane' component to resize the texture proportionally to the dimensions of the viewport.
      meshMaterial.uniforms.uZoomScale!.value.x = viewport.width / width;
      meshMaterial.uniforms.uZoomScale!.value.y = viewport.height / height

      if (meshMaterial.uniforms.uProgress)
        gsap.to(meshMaterial.uniforms.uProgress, { value: active ? 1 : 0 })

      if (meshMaterial.uniforms.uRes)
        gsap.to(meshMaterial.uniforms.uRes.value, {
          x: active ? viewport.width : width,
          y: active ? viewport.height : height
        })
    }
  }, [viewport, active, width, height])

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uProgress: { value: 0 },
        uZoomScale: { value: { x: 1, y: 1 } },
        uTex: { value: tex },
        uRes: { value: { x: 1, y: 1 } },
        uImageRes: {
          value: { x: tex.source.data.width, y: tex.source.data.height }
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    }),
    [tex]
  )

  return (
    <mesh ref={meshRef} {...props}>
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  )
}

export default Plane

type PlaneType = {
  texture: string;
  width: number;
  height: number;
  active: boolean | null;
}