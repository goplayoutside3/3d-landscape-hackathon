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
  Scene,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from '../utils/GLTFLoader'
import { OrbitControls } from '../utils/OrbitControls'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animating: true,
    }
  }

  componentDidMount() {
    this.sceneSetup()
    this.loadPlants()
    this.animate() // this is the 'render loop' for Three.js
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
    window.cancelAnimationFrame(this.requestID)
    this.controls.dispose()
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
    this.camera.position.y = 2 // above the scene
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
    const geometry = new PlaneBufferGeometry(15, 10, 1)
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
    // this.raycaster = new THREE.Raycaster()
    // this.renderer.domElement.addEventListener('click', this.handleClick, false)
    // this.mouse = new THREE.Vector2()
  }

  loadPlants = () => {
    const loader = new GLTFLoader()
    loader.load('/models/flattened_grass/flattened_grass.gltf', gltf => {
      const flattenedGrass = gltf.scene
      this.scene.add(flattenedGrass)
    })
    loader.load('/models/grass_chunk/grass_chunk.gltf', gltf => {
      const grassChunk = gltf.scene
      this.scene.add(grassChunk)
      grassChunk.position.x += 4
    })
    loader.load('/models/small_grass_chunk/small_grass_chunk.gltf', gltf => {
      const grassChunk = gltf.scene
      this.scene.add(grassChunk)
      grassChunk.position.x -= 4
    })
    loader.load(
      '/models/smallest_grass_chunk/smallest_grass_chunk.gltf',
      gltf => {
        const grassChunk = gltf.scene
        this.scene.add(grassChunk)
        grassChunk.position.x -= 4
        grassChunk.position.z -= 2
      }
    )
    loader.load('/models/crocus/crocus.gltf', gltf => {
      const crocus = gltf.scene
      this.scene.add(crocus)
      crocus.position.x += 1
    })
    loader.load('/models/daffodil/daffodil.gltf', gltf => {
      const daffodil = gltf.scene
      this.scene.add(daffodil)
      daffodil.position.x -= 1
    })
    loader.load('/models/tulip/tulip.gltf', gltf => {
      const tulip = gltf.scene
      this.scene.add(tulip)
      tulip.position.z -= 1
    })
    loader.load('/models/snowdrop/snowdrop.gltf', gltf => {
      const snowdrop = gltf.scene
      this.scene.add(snowdrop)
      snowdrop.position.z += 1
    })
    loader.load('/models/anemone/anemone.gltf', gltf => {
      const anemone = gltf.scene
      this.scene.add(anemone)
      anemone.position.x += 2
    })
  }

  loadRabbit = () => {
    // run this inside the loader if built-in animations
    this.millMixer = new AnimationMixer(gltf.scene)
    this.clips = gltf.animations
    this.clips.forEach(clip => {
      this.millMixer.clipAction(clip).play()
    })
  }

  animate = () => {
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    requestAnimationFrame(this.animate)
    // if (this.millMixer) this.millMixer.update(0.04)
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

  render() {
    return (
      <div className={styles['canvas-cont']}>
        <div
          ref={ref => (this.mount = ref)}
          id='canvas'
          className={styles.canvas}
        />
      </div>
    )
  }
}

export default Home
