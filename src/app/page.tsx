'use client'
import { Canvas } from '@react-three/fiber'
import Carousel from '@/three/Carousel'


const Home=()=> {
  return (
    <>
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} 
      // onPointerMissed={() => (state.clicked = null)}
      >

          <Carousel />

      </Canvas>
    </>
  )
}

export default Home