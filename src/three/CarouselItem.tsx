'use client'
import gsap from 'gsap';
import Plane from './Plane';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

const CarouselItem = ({
  index,
  width,
  height,
  setActivePlane,
  activePlane,
  item
}: CarosoleItemTypes) => {
  const group = useRef<THREE.Group>(null!)
  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState<boolean | null>(false)
  const [isCloseActive, setCloseActive] = useState(false)
  const timeoutID = useRef<NodeJS.Timeout>()
  const { viewport } = useThree()

  useEffect(() => {
    if (activePlane === index) {
      setIsActive(activePlane === index)
      setCloseActive(true)
    } else {
      setIsActive(null)
    }
  }, [activePlane, index])

  useEffect(() => {
    gsap.killTweensOf(group.current.position)
    gsap.to(group.current.position, {
      z: isActive ? 0 : -0.01,
      duration: 0.2,
      ease: 'power3.out',
      delay: isActive ? 0 : 2
    })
  }, [isActive])

  /*------------------------------
  Hover effect
  ------------------------------*/
  useEffect(() => {
    const hoverScale = hover && !isActive ? 1.1 : 1
    gsap.to(group.current.scale, {
      x: hoverScale,
      y: hoverScale,
      duration: 0.5,
      ease: 'power3.out'
    })
  }, [hover, isActive])

  const handleClose = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (!isActive) return
    setActivePlane(null)
    setHover(false)
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setCloseActive(false)
    }, 1500) // The duration of this timer depends on the duration of the plane's closing animation.
  }

  return (
    <group
      ref={group}
      onClick={() => {
        setActivePlane(index)
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Plane
        width={width}
        height={height}
        texture={item.image}
        active={isActive}
      />

      {isCloseActive ? (
        <mesh position={[0, 0, 0.01]} onClick={handleClose}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial transparent={true} opacity={0} color={'red'} />
        </mesh>
      ) : null}
    </group>
  )
}

export default CarouselItem

type CarosoleItemTypes = {
  index: number;
  width: number;
  height: number;
  setActivePlane: (index: number | null) => void;
  activePlane: number | null;
  item: { image: string }
}