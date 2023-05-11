'use client'

import CarouselItem from './CarouselItem';
import gsap from 'gsap';
import images from '@/data/images';
import PostProcessing from './PostProcessing';
import { getPiramidalIndex, lerp } from '@/utils/general';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { usePrevious } from 'react-use';

/*------------------------------
Plane Settings
------------------------------*/
const planeSettings = {
  width: 1,
  height: 2.5,
  gap: 0.1
}

/*------------------------------
Gsap Defaults
------------------------------*/
gsap.defaults({
  duration: 2.5,
  ease: 'power3.out'
})

/*------------------------------
Carousel
------------------------------*/
const Carousel = () => {
  const [group, setGroup] = useState<THREE.Group | null>(null!)
  const postProcessingRef = useRef<JSX.IntrinsicElements['meshTransmissionMaterial']>()

  const [activePlane, setActivePlane] = useState<number | null>(null)
  const prevActivePlane = usePrevious(activePlane)
  const { viewport } = useThree()

  /*--------------------
  Vars
  --------------------*/
  const progress = useRef(0)
  const startX = useRef(0)
  const isDown = useRef(false)
  const speedWheel = 0.02
  const speedDrag = -0.3
  const oldProgress = useRef(0)
  const speed = useRef(0)
  const groupArray = useMemo(() => {
    if (group) return group.children
  }, [group])

  /*--------------------
  Diaplay Items
  --------------------*/
  const displayItems = (item: { position: gsap.TweenTarget }, index: number, active: number) => {
    if (groupArray) {
      const piramidalIndex = getPiramidalIndex(groupArray, active)[index] as number
      gsap.to(item.position, {
        x: (index - active) * (planeSettings.width + planeSettings.gap),
        y: groupArray.length * -0.1 + piramidalIndex * 0.1
      })
    }
  }

  /*--------------------
  RAF
  --------------------*/
  useFrame(() => {
    progress.current = Math.max(0, Math.min(progress.current, 100))
    if (groupArray) {
      const active = Math.floor((progress.current / 100) * (groupArray.length - 1))
      groupArray.forEach((item: { position: gsap.TweenTarget }, index: number) => displayItems(item, index, active))
      speed.current = lerp(
        speed.current,
        Math.abs(oldProgress.current - progress.current),
        0.1
      )

      oldProgress.current = lerp(oldProgress.current, progress.current, 0.1)

      if (postProcessingRef.current) {
        postProcessingRef.current.thickness = speed.current
      }
    }
  })

  /*--------------------
  Handle Wheel
  --------------------*/
  const handleWheel = (e: { stopPropagation: () => void; deltaY: number; deltaX: number }) => {
    e.stopPropagation()
    if (activePlane !== null) return
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    progress.current = progress.current + wheelProgress * speedWheel
  }

  /*--------------------
  Handle Down
  --------------------*/
  const handleDown = (e: ThreeEvent<MouseEvent> | ThreeEvent<TouchEvent>) => {
    e.stopPropagation()
    if (activePlane !== null) return
    isDown.current = true
    if ('touches' in e) {
      (e.touches && e.touches[0]!.clientX) || 0
    } else {
      startX.current = e.clientX || 0

    }
  }

  /*--------------------
  Handle Up
  --------------------*/
  const handleUp = () => {
    isDown.current = false
  }

  /*--------------------
  Handle Move
  --------------------*/
  const handleMove = (e: ThreeEvent<MouseEvent> | ThreeEvent<TouchEvent>) => {
    e.stopPropagation()
    if (activePlane !== null || !isDown.current) return
    const x = ('touches' in e) ? (e.touches && e.touches[0]!.clientX) : e.clientX || 0
    const mouseProgress = (x - startX.current) * speedDrag
    progress.current = progress.current + mouseProgress
    startX.current = x
  }

  /*--------------------
  Click
  --------------------*/
  useEffect(() => {
    if (!groupArray) return

    if (activePlane !== null && prevActivePlane === null) {
      progress.current = (activePlane / (groupArray.length - 1)) * 100 // Calculate the progress.current based on activePlane
    }
  }, [activePlane, groupArray, prevActivePlane])

  /*--------------------
  Render Plane Events
  --------------------*/
  const renderPlaneEvents = () => {
    return (
      <mesh
        position={[0, 0, -0.01]}
        onWheel={handleWheel}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerMove={handleMove}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>
    )
  }

  /*--------------------
  Render Slider
  --------------------*/
  const renderSlider = () => {
    return (
      <group ref={setGroup}>
        {images.map((item, i) => (
          <CarouselItem
            width={planeSettings.width}
            height={planeSettings.height}
            setActivePlane={setActivePlane}
            activePlane={activePlane}
            key={item.image}
            item={item}
            index={i}
          />
        ))}
      </group>
    )
  }

  return (
    <group>
      {renderPlaneEvents()}
      {renderSlider()}
      <PostProcessing ref={postProcessingRef} />
    </group>
  )
}

export default Carousel
