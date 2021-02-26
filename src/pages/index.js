import React, { Component } from 'react'
import Head from 'next/head'
import styles from '../styles/home.module.scss'
import { AnimationMixer, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
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
    this.loadWindmill()
    this.animate() // this is the 'render loop' for Three.js
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
    window.cancelAnimationFrame(this.requestID)
    this.controls.dispose()
  }

  handleWindowResize = () => {
    const container = document
      .getElementById('canvas')
      .getBoundingClientRect()
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
    this.camera.position.z = 5 // change this if needed
    this.controls = new OrbitControls(this.camera, this.mount)
    this.controls.enableZoom = false

    this.renderer = new WebGLRenderer({
      alpha: true,
    })
    const container = document
      .getElementById('canvas')
      .getBoundingClientRect()
    this.renderer.setSize(container.width, container.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.mount.appendChild(this.renderer.domElement)

    // Lights
    const lightOne = new DirectionalLight(0xffffff, 1)
    lightOne.position.set(0, 900, 0)
    lightOne.target.position.set(0, -500, 0)
    this.scene.add(lightOne)
    this.scene.add(lightOne.target)

    const lightTwo = new DirectionalLight(0xffffff, 1)
    lightTwo.position.set(200, 800, 0)
    lightTwo.target.position.set(-200, -400, 0)
    this.scene.add(lightTwo)
    this.scene.add(lightTwo.target)

    // Click Event
    // this.raycaster = new THREE.Raycaster()
    // this.renderer.domElement.addEventListener('click', this.handleClick, false)
    // this.mouse = new THREE.Vector2()
  }

  // visual tree of GLTF object
  dumpObject = (obj, lines = [], isLast = true, prefix = '') => {
    const localPrefix = isLast ? '└─' : '├─'
    lines.push(
      `${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${
        obj.type
      }]`
    )
    const newPrefix = prefix + (isLast ? '  ' : '│ ')
    const lastNdx = obj.children.length - 1
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx
      this.dumpObject(child, lines, isLast, newPrefix)
    })
    return lines
  }

  loadWindmill = () => {
    const loader = new GLTFLoader()
    const url = '/models/wooden_house/scene.gltf'
    loader.load(url, (gltf) => {
      this.model = gltf.scene
      this.scene.add(this.model)
      // this.model.position.y -= 375
      // this.model.rotation.y += 0.7

      // if built-in animations
      // this.millMixer = new AnimationMixer(gltf.scene)
      // this.clips = gltf.animations
      // this.clips.forEach((clip) => {
      //   this.millMixer.clipAction(clip).play()
      // })
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

  resizeRendererToDisplaySize = (renderer) => {
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
      <div className={styles["canvas-cont"]}>
        <div
          ref={(ref) => (this.mount = ref)}
          id="canvas"
          className={styles.canvas}
        />
      </div>
    )
  }
}

export default Home