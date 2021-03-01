import React, { cloneElement, Component } from 'react'
import Head from 'next/head'
import styles from '../styles/home.module.scss'
import {
  AmbientLight,
  AnimationMixer,
  Clock,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from '../utils/GLTFLoader'
import { OrbitControls } from '../utils/OrbitControls'
import classes from 'classnames'
import gsap from 'gsap'

class Home extends Component {
  constructor(props) {
    super(props)
    this.camera = null
    this.controls = null
    this.renderer = null
    this.scene = null
    this.mount = null
    this.mouse = null
    this.raycaster = null
    this.rabbit = null
    this.state = {
      audioPlaying: false,
      flowerAnimating: false,
      rabbitAnimating: false,
    }
  }

  componentDidMount() {
    this.sceneSetup()
    this.loadPlants()
    this.loadRabbit()
    this.animate() // this is the 'render loop' for Three.js
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
    window.cancelAnimationFrame(this.requestID)
    this.controls.dispose()
    this.renderer.domElement.removeEventListener('mousemove', this.handleHover)
  }

  handleWindowResize = () => {
    const container = document.getElementById('canvas').getBoundingClientRect()
    this.renderer.setSize(container.width, container.height)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  sceneSetup = () => {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this.camera.position.z = 3.5 // back up away from scene
    this.camera.position.y = 2.5 // above the scene
    this.camera.lookAt(0, 0, 0)

    this.controls = new OrbitControls(this.camera, this.mount)
    this.controls.enableZoom = true
    this.controls.panSpeed = 0.5
    this.controls.rotateSpeed = 0.5
    this.controls.zoomSpeed = 0.5

    this.renderer = new WebGLRenderer({
      alpha: true,
    })
    const container = document.getElementById('canvas').getBoundingClientRect()
    this.renderer.setSize(container.width, container.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.mount.appendChild(this.renderer.domElement)

    // Lights
    const ambientLight = new AmbientLight(0xffffff, 1)
    this.scene.add(ambientLight)

    const lightOne = new DirectionalLight(0xffffff, 1)
    lightOne.position.set(0.8, 1, 0.5)
    lightOne.target.position.set(0, 0, 0)
    this.scene.add(lightOne)
    this.scene.add(lightOne.target)

    const lightTwo = new DirectionalLight(0xffffff, 0.8)
    lightTwo.position.set(0.5, 1, 0.8)
    lightTwo.target.position.set(0, 0, 0)
    this.scene.add(lightTwo)
    this.scene.add(lightTwo.target)

    // Create a Plane for the ground
    const geometry = new PlaneBufferGeometry(10.5, 7, 1)
    const material = new MeshBasicMaterial({
      color: 0x4a3b1c,
      side: DoubleSide,
    })
    this.plane = new Mesh(geometry, material)
    this.plane.rotation.x -= Math.PI / 2
    this.scene.add(this.plane)

    // Flowers are attached to an object specifically for Raycasting
    this.flowerbed = new Group()
    this.scene.add(this.flowerbed)

    // Click Event
    this.raycaster = new Raycaster()
    this.mouse = new Vector2()
    this.renderer.domElement.addEventListener(
      'mousemove',
      this.handleHover,
      false
    )
  }

  loadPlants = () => {
    const loader = new GLTFLoader()
    loader.load('/models/flattened_grass/flattened_grass.gltf', gltf => {
      const clone = gltf.scene.clone()
      const clone2 = gltf.scene.clone()
      const clone3 = gltf.scene.clone()
      clone.position.set(0.5, 0, 0.9)
      clone2.position.set(3.4, 0, 0.95)
      clone3.position.set(-3.5, 0, -0.9)
      this.scene.add(gltf.scene, clone, clone2, clone3)
    })
    loader.load('/models/grass_chunk/grass_chunk.gltf', gltf => {
      const clone = gltf.scene.clone()
      const clone2 = gltf.scene.clone()
      this.scene.add(gltf.scene, clone, clone2)
      gltf.scene.position.set(3.8, 0, -3.8)
      clone.position.set(-2.6, 0, 1.2)
      clone2.position.set(-1.5, 0, -3.7)
    })
    loader.load('/models/small_grass_chunk/small_grass_chunk.gltf', gltf => {
      const clone = gltf.scene
      const clone2 = gltf.scene.clone()
      const clone3 = gltf.scene.clone()
      this.scene.add(gltf.scene, clone, clone2, clone3)
      gltf.scene.position.set(-4, 0, 0)
      clone.position.set(0, 0, -3.7)
      clone2.position.set(0.8, 0, -3.6)
      clone3.position.set(1.5, 0, -3.7)
    })
    loader.load(
      '/models/smallest_grass_chunk/smallest_grass_chunk.gltf',
      gltf => {
        const clone = gltf.scene.clone()
        const clone2 = gltf.scene.clone()
        this.scene.add(gltf.scene, clone, clone2)
        gltf.scene.position.set(4, 0, 2)
        clone.position.set(-4, 0, 0)
        clone2.position.set(1.5, 0, 1.8)
      }
    )
    loader.load('/models/crocus/crocus.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      const rabbitTrigger = gltf.scene.clone()
      const clone = gltf.scene.clone()
      const clone2 = gltf.scene.clone()
      const clone3 = gltf.scene.clone()
      const clone4 = gltf.scene.clone()
      const clone5 = gltf.scene.clone()
      const clone6 = gltf.scene.clone()
      gltf.scene.position.set(1, -0.1, 0.2)
      clone.position.set(2, 0, 2)
      clone.rotation.set(0, 0.4, 0)
      clone2.position.set(2.8, 0, 1.1)
      clone3.position.set(2.4, -0.1, 1.4)
      clone4.position.set(3, -0.1, 1.2)
      clone4.rotation.set(0, 1, 0)
      clone5.position.set(0.1, 0, 0)
      clone6.position.set(1.1, -0.2, 1.8)
      rabbitTrigger.position.set(-2.45, 0, 0.5)
      rabbitTrigger.userData.trigger = true
      this.flowerbed.add(
        gltf.scene,
        clone,
        clone2,
        clone3,
        clone4,
        clone5,
        clone6,
        rabbitTrigger
      )
    })
    loader.load('/models/daffodil/daffodil.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      const clone = gltf.scene.clone()
      gltf.scene.position.set(1, 0, 1)
      gltf.scene.rotation.set(0, 0.6, 0)
      clone.position.set(-2.3, -0.1, -0.5)
      clone.rotation.set(0,-0.5, 0)
      this.flowerbed.add(gltf.scene, clone)
    })
    loader.load('/models/tulip/tulip.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      const clone = gltf.scene.clone()
      const clone2 = gltf.scene.clone()
      const clone3 = gltf.scene.clone()
      gltf.scene.position.set(0, 0, -1)
      clone.position.set(4.2, -0.1, -1.9)
      clone.rotation.set(0, 1, 0)
      clone2.position.set(3.4, -0.2, 0.3)
      clone3.position.set(-4.1, 0, -0.2)
      this.flowerbed.add(gltf.scene, clone, clone2, clone3)
    })
    loader.load('/models/snowdrop/snowdrop.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      const clone = gltf.scene.clone()
      const clone2 = gltf.scene.clone()
      const clone3 = gltf.scene.clone()
      const clone4 = gltf.scene.clone()
      gltf.scene.position.set(2.7, 0, -2)
      clone.position.set(3.6, 0, -1.7)
      clone.rotation.set(0, 1, 0)
      clone2.position.set(-3, 0, -3)
      clone2.rotation.set(0, -1, 0)
      clone3.position.set(-3.2, 0, 1.5)
      clone3.rotation.set(0, 2, 0)
      clone4.position.set(0.8, -0.3, 1.5)
      clone4.rotation.set(0, -0.4, 0)
      this.flowerbed.add(gltf.scene, clone, clone2, clone3, clone4)
    })
    loader.load('/models/anemone/anemone.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      const clone = gltf.scene.clone()
      const clone2 = gltf.scene.clone()
      clone.position.set(-1.5, 0, -0.7)
      clone.rotation.set(0, 1.8, 0)
      clone2.position.set(3.2, -0.1, 2.1)
      clone2.rotation.set(0, -0.4, 0)
      gltf.scene.position.set(2, 0, 0)
      this.flowerbed.add(gltf.scene, clone, clone2)
    })
  }

  loadRabbit = () => {
    const loader = new GLTFLoader()
    loader.load('/models/rabbit/rabbit.gltf', gltf => {
      this.rabbit = gltf.scene
      this.rabbit.rotation.y += Math.PI / 2
      this.rabbit.position.set(-3.5, 0, 0.5)
      this.scene.add(this.rabbit)

      this.millMixer = new AnimationMixer(gltf.scene)
      this.clips = gltf.animations
      this.clips.forEach(clip => {
        this.millMixer.clipAction(clip).play()
        this.millMixer.clipAction(clip).paused = true
      })
    })
  }

  animate = () => {
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    requestAnimationFrame(this.animate)
    if (this.millMixer) {
      this.millMixer.update(0.02)
    }
    this.renderer.render(this.scene, this.camera)
  }

  resizeRendererToDisplaySize = renderer => {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  handleHover = e => {
    e.preventDefault()
    const { flowerAnimating } = this.state

    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(
      this.flowerbed.children,
      true
    )
    if (intersects.length > 0 && !flowerAnimating) {
      let currentIntersection

      if (
        intersects[0].object.parent.parent &&
        intersects[0].object.parent.parent.userData.id
      ) {
        currentIntersection = intersects[0].object.parent.parent
      } else if (
        intersects[0].object.parent &&
        intersects[0].object.parent.userData.id
      ) {
        currentIntersection = intersects[0].object.parent
      }
      if (currentIntersection && currentIntersection.userData.trigger)
        this.handleRabbitAnimation()
      if (currentIntersection && currentIntersection.userData.id) {
        const rotationY = currentIntersection.rotation.y
        let scaleRef = { value: 0 }
        const tl = gsap.timeline()
        tl.to(scaleRef, {
          value: 0.2,
          duration: 0.2,
          onUpdate: () => {
            currentIntersection.rotation.set(0, rotationY, scaleRef.value)
          },
          onStart: () => this.setState({ flowerAnimating: true }),
        })
          .to(scaleRef, {
            value: -0.2,
            duration: 0.2,
            onUpdate: () => {
              currentIntersection.rotation.set(0, rotationY, scaleRef.value)
            },
          })
          .to(scaleRef, {
            value: 0,
            duration: 0.2,
            onUpdate: () => {
              currentIntersection.rotation.set(0, rotationY, scaleRef.value)
            },
            onComplete: () => this.setState({ flowerAnimating: false }),
          })
      }
    }
  }

  handleAudio = () => {
    if (this.state.audioPlaying) {
      this.audio.pause()
      this.setState({ audioPlaying: false })
    } else {
      this.audio.play()
      this.setState({ audioPlaying: true })
    }
  }

  handleRabbitAnimation = () => {
    if (this.state.rabbitAnimating) return
    this.clips.forEach(clip => {
      this.millMixer.clipAction(clip).paused = false
    })
    this.setState({ rabbitAnimating: true })
    let scaleRef = { value: -3.5 } // same spot where it's loaded
    const tl = gsap.timeline()
    tl.to(scaleRef, {
      value: 8,
      duration: 5,
      ease: 'sine.in',
      onUpdate: () => {
        this.rabbit.position.set(scaleRef.value, 0, 0.5)
      },
      onComplete: () => {
        this.scene.remove(this.rabbit)
        setTimeout(() => {
          this.setState({ rabbitAnimating: false })
          this.loadRabbit()
        }, 1000)
      },
    })
  }

  render() {
    return (
      <>
        <Head>
          <title>Spring Scene</title>
          <link rel='shortcut icon' type='image/x-icon' href=''></link>
        </Head>
        <main className={styles['canvas-cont']}>
          <audio
            ref={ref => (this.audio = ref)}
            loop
            src='/spring.mp3'
            type='audio/mp3'
          />
          <button
            onClick={this.handleAudio}
            className={classes(styles.audio, {
              [styles.playing]: this.state.audioPlaying,
            })}
          />
          <div
            ref={ref => (this.mount = ref)}
            id='canvas'
            className={styles.canvas}
          />
        </main>
      </>
    )
  }
}

export default Home
