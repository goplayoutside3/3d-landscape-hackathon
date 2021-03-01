import React, { Component } from 'react'
import Head from 'next/head'
import styles from '../styles/home.module.scss'
import {
  AmbientLight,
  AnimationMixer,
  DirectionalLight,
  DoubleSide,
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
      animating: false,
      audioPlaying: false,
      currentFlower: null
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
    this.renderer.domElement.removeEventListener(
      'mousemove',
      this.handleHover
    )
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
    this.camera.position.z = 4 // back up away from scene
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
    lightOne.position.set(0, 1, 0.5)
    lightOne.target.position.set(0, 0, 0)
    this.scene.add(lightOne)
    this.scene.add(lightOne.target)

    // Create a Plane for the ground
    const geometry = new PlaneBufferGeometry(10.5, 7, 1)
    const material = new MeshBasicMaterial({
      color: 0x433519,
      side: DoubleSide,
    })
    // add texture
    material.needsUpdate = true
    this.plane = new Mesh(geometry, material)
    this.plane.rotation.x -= Math.PI / 2
    this.scene.add(this.plane)

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
      clone.position.set(-2.8, 0, 1.2)
      clone2.position.set(-1.5, 0, -3.7)
    })
    loader.load('/models/small_grass_chunk/small_grass_chunk.gltf', gltf => {
      const clone = gltf.scene
      const clone2 = gltf.scene
      const clone3 = gltf.scene
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
      const clone = gltf.scene.clone()
      const clone2 = gltf.scene.clone()
      const clone3 = gltf.scene.clone()
      this.scene.add(gltf.scene, clone, clone2, clone3)
      gltf.scene.position.set(1, 0, 0)
      clone.position.set(2, 0, 2)
      clone2.position.set(2.5, 0, 1)
      clone3.position.set(-2.5, 0, 1.5)
    })
    loader.load('/models/daffodil/daffodil.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      this.scene.add(gltf.scene)
      gltf.scene.position.set(1, 0, 1)
    })
    loader.load('/models/tulip/tulip.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      this.scene.add(gltf.scene)
      gltf.scene.position.set(0, 0, -1)
    })
    loader.load('/models/snowdrop/snowdrop.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      const clone = gltf.scene.clone()
      this.scene.add(gltf.scene, clone)
      gltf.scene.position.set(0, 0, 1)
    })
    loader.load('/models/anemone/anemone.gltf', gltf => {
      gltf.scene.userData.id = 'flower'
      this.scene.add(gltf.scene)
      gltf.scene.position.set(2, 0, 0)
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
    if (this.millMixer) this.millMixer.update(0.01)
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
    const { currentFlower } = this.state
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length > 0) {
      const currentIntersection = intersects[0].object.parent.parent
      if (currentIntersection && currentIntersection.userData.id) {
        if (currentFlower === null || currentFlower && currentFlower.userData.id !== currentIntersection.userData.id) {
          this.setState({ currentFlower: currentIntersection })
          let scaleRef = { value: 1 }
          // change this to a swaying animation that auto completes
          gsap.to(scaleRef, {
            value: 1.5,
            duration: 0.2,
            ease: 'linear',
            onUpdate: () => {
              currentIntersection.scale.set(scaleRef.value, scaleRef.value, scaleRef.value)
            }
          })
        }
      }
    } else {
      if (currentFlower) {
        let scaleRef = { value: 1.5 }
        gsap.to(scaleRef, {
          value: 1,
          duration: 0.2,
          ease: 'linear',
          onUpdate: () => {
            currentFlower.scale.set(scaleRef.value, scaleRef.value, scaleRef.value)
          }
        })
      }
      this.setState({ currentFlower: null })
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
    if (this.state.animating) {
      this.clips.forEach(clip => {
        this.millMixer.clipAction(clip).paused = true
      })
      this.setState({ animating: false })
    } else {
      this.clips.forEach(clip => {
        this.millMixer.clipAction(clip).paused = false
      })
      this.setState({ animating: true })
    }
  }

  render() {
    return (
      <>
        <Head>
          <title>3D Flower Field</title>
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
          <button onClick={this.handleRabbitAnimation} className={styles.rabbit}>
            Animate
          </button>
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
