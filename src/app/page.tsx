'use client'
import { Canvas } from '@react-three/fiber'
import Carousel from '@/three/Carousel'


const Home=()=> {
  return (
    <>
      <Canvas >
          <Carousel />
      </Canvas>
    </>
  )
}

export default Home